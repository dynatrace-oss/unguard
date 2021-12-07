package org.dynatrace.microblog;

import io.jsonwebtoken.Claims;
import io.opentracing.Tracer;
import org.dynatrace.microblog.authservice.UserAuthServiceClient;
import org.dynatrace.microblog.dto.Post;
import org.dynatrace.microblog.dto.PostId;
import org.dynatrace.microblog.dto.SerializedPost;
import org.dynatrace.microblog.dto.User;
import org.dynatrace.microblog.exceptions.*;
import org.dynatrace.microblog.form.PostForm;
import org.dynatrace.microblog.redis.RedisClient;
import org.dynatrace.microblog.utils.JwtTokensUtils;
import org.dynatrace.microblog.utils.PostSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RestController
public class MicroblogController {

    private final RedisClient redisClient;
    Logger logger = LoggerFactory.getLogger(MicroblogController.class);
    private final UserAuthServiceClient userAuthServiceClient;
	private final PostSerializer postSerializer;

    @Autowired
    public MicroblogController(Tracer tracer, PostSerializer postSerializer) {
        String redisServiceAddress;
        String userAuthServiceAddress;
        if (System.getenv("REDIS_SERVICE_ADDRESS") != null) {
            redisServiceAddress = System.getenv("REDIS_SERVICE_ADDRESS");
            logger.info("REDIS_SERVICE_ADDRESS set to {}", redisServiceAddress);
        } else {
            redisServiceAddress = "localhost";
            logger.warn("No REDIS_SERVICE_ADDRESS environment variable defined, falling back to localhost.");
        }

        if (System.getenv("USER_AUTH_SERVICE_ADDRESS") != null) {
            userAuthServiceAddress = System.getenv("USER_AUTH_SERVICE_ADDRESS");
            logger.info("USER_AUTH_SERVICE_ADDRESS set to {}", userAuthServiceAddress);
        } else {
            userAuthServiceAddress = "localhost:9091";
            logger.warn("No USER_AUTH_SERVICE_ADDRESS environment variable defined, falling back to localhost:9091.");
        }

        this.userAuthServiceClient = new UserAuthServiceClient(userAuthServiceAddress);
        this.redisClient = new RedisClient(redisServiceAddress, this.userAuthServiceClient, tracer);
        this.postSerializer = postSerializer;
    }

    @RequestMapping("/timeline")
    public List<Post> timeline(@CookieValue(value = "jwt", required = false) String jwt) throws InvalidJwtException, NotLoggedInException {
        checkJwt(jwt);

        return redisClient.getTimeline(jwt);
    }

    @RequestMapping("/mytimeline")
    public List<Post> myTimeline(@CookieValue(value = "jwt", required = false) String jwt) throws InvalidJwtException, NotLoggedInException {
        checkJwt(jwt);

        Claims claims = JwtTokensUtils.decodeTokenClaims(jwt);
        return redisClient.getUserTimeline(jwt, claims.get("userid").toString());
    }

    @PostMapping("/users/{user}/follow")
    public void follow(@CookieValue(value = "jwt", required = false) String currentUserJwt,
                       @PathVariable("user") String userToFollow) throws FollowYourselfException, InvalidJwtException, InvalidUserException, UserNotFoundException, IOException, NotLoggedInException {

        checkJwt(currentUserJwt);

        Claims claims = JwtTokensUtils.decodeTokenClaims(currentUserJwt);

        String currentUserId = claims.get("userid").toString();
        String userIdToFollow = userAuthServiceClient.getUserIdFromUsername(currentUserJwt, userToFollow);
        if (userIdToFollow == null) {
            throw new InvalidUserException();
        }
        // disallow following yourself
        if (currentUserId.equals(userIdToFollow)) {
            throw new FollowYourselfException();
        }
        redisClient.follow(currentUserId, userIdToFollow);
    }

    @GetMapping("/users/{user}/posts")
    public List<Post> getUserPosts(@PathVariable("user") String user,
                                   @RequestParam(defaultValue = "10") String limit, @CookieValue(value="jwt", required = false) String jwt) throws UserNotFoundException, InvalidJwtException, IOException {

        if(!userAuthServiceClient.checkTokenValidity(jwt)) throw new InvalidJwtException();

        return redisClient.getUserPosts(jwt, user, Integer.parseInt(limit));
    }

    @GetMapping("/users/{user}/followers")
    public Collection<User> getFollowers(@PathVariable("user") String user, @CookieValue(value="jwt", required = false) String jwt) throws UserNotFoundException, InvalidJwtException, IOException, NotLoggedInException {
        checkJwt(jwt);

        String userId = userAuthServiceClient.getUserIdFromUsername(jwt, user);
        return redisClient.getFollowers(jwt, userId);
    }

    @PostMapping("/post")
    public PostId post(@RequestBody PostForm postForm, @CookieValue(value = "jwt", required = false) String jwt) throws InvalidUserException, InvalidJwtException, NotLoggedInException {
        checkJwt(jwt);

        // decode JWT
        Claims claims = JwtTokensUtils.decodeTokenClaims(jwt);
        String postId = redisClient.newPost(claims.get("userid").toString(), postForm.getContent(), postForm.getImageUrl());
        return new PostId(postId);
    }

    @GetMapping("/post/{postid}")
    public Post getPost(@PathVariable("postid") String postId, @CookieValue(value="jwt", required = false) String jwt) throws UserNotFoundException, InvalidJwtException, IOException, NotLoggedInException {
        checkJwt(jwt);
		final Post post = redisClient.getPost(jwt, postId);
		postSerializer.serializePost(new SerializedPost(post.getUsername(), post.getBody(), post.getImageUrl(), post.getTimestamp(), UUID.randomUUID()));
		return post;
    }

    public void checkJwt(String jwt) throws InvalidJwtException, NotLoggedInException {
        if (jwt == null) {
            throw new NotLoggedInException();
        }
        if (!userAuthServiceClient.checkTokenValidity(jwt)) throw new InvalidJwtException();
    }
}
