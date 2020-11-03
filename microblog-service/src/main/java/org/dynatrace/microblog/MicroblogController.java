package org.dynatrace.microblog;

import io.opentracing.Tracer;
import org.dynatrace.microblog.dto.Post;
import org.dynatrace.microblog.dto.User;
import org.dynatrace.microblog.exceptions.FollowYourselfException;
import org.dynatrace.microblog.exceptions.InvalidUserException;
import org.dynatrace.microblog.exceptions.UnauthorizedException;
import org.dynatrace.microblog.exceptions.UserAlreadyExistsException;
import org.dynatrace.microblog.form.PostForm;
import org.dynatrace.microblog.redis.RedisClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PreDestroy;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;

@RestController
public class MicroblogController {

    private final RedisClient redisClient;
    Logger logger = LoggerFactory.getLogger(MicroblogController.class);

    @Autowired
    public MicroblogController(Tracer tracer) {
        String redisServiceAddress;
        if (System.getenv("REDIS_SERVICE_ADDRESS") != null) {
            redisServiceAddress = System.getenv("REDIS_SERVICE_ADDRESS");
            logger.info("REDIS_SERVICE_ADDRESS set to " + redisServiceAddress);
        } else {
            redisServiceAddress = "localhost";
            logger.warn("No REDIS_SERVICE_ADDRESS environment variable defined, falling back to localhost.");
        }

        this.redisClient = new RedisClient(redisServiceAddress, tracer);
    }

    @PostMapping("/register")
    public String register(@RequestParam String username) throws UserAlreadyExistsException {
        return redisClient.newUser(username);
    }

    @PostMapping("/login")
    public void login(HttpServletResponse response,
                      @RequestParam String username) throws InvalidUserException {
        if (redisClient.getUserIdFromUsername(username) == null) {
            throw new InvalidUserException();
        }

        // create a cookie with the username as a login token
        // much secure. very wow.
        Cookie cookie = new Cookie("username", username);

        // add cookie to response
        response.addCookie(cookie);
    }

    @RequestMapping("/timeline")
    public List<Post> timeline() {
        return redisClient.getTimeline();
    }

    @RequestMapping("/mytimeline")
    public List<Post> myTimeline(@CookieValue(value = "username") String currentUser) throws UnauthorizedException, InvalidUserException {
        String currentUserId = getUserIdIfValid(currentUser);
        return redisClient.getUserTimeline(currentUserId);
    }

    /**
     * Checks if the username is set and if it is registered already
     *
     * @param username username of the user
     * @return user id of the user if valid
     * @throws UnauthorizedException if username is null
     * @throws InvalidUserException  if username is not registered
     */
    @NonNull
    private String getUserIdIfValid(String username) throws UnauthorizedException, InvalidUserException {
        if (username == null) {
            throw new UnauthorizedException();
        }
        String currentUserId = redisClient.getUserIdFromUsername(username);
        if (currentUserId == null) {
            throw new InvalidUserException();
        }
        return currentUserId;
    }

    @PostMapping("/users/{user}/follow")
    public void follow(@CookieValue(value = "username") String currentUser,
                       @PathVariable("user") String userToFollow) throws FollowYourselfException, UnauthorizedException, InvalidUserException {
        String currentUserId = getUserIdIfValid(currentUser);
        String userIdToFollow = redisClient.getUserIdFromUsername(userToFollow);
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
                                   @RequestParam(defaultValue = "10") String limit) {
        return redisClient.getUserPosts(user, Integer.parseInt(limit));
    }

    @GetMapping("/users/{user}/followers")
    public Collection<User> getFollowers(@PathVariable("user") String user) {
        String userId = redisClient.getUserIdFromUsername(user);
        return redisClient.getFollowers(userId);
    }

    @PostMapping("/post")
    public void post(@CookieValue(value = "username") String currentUser,
                     @RequestBody PostForm postForm) throws InvalidUserException, UnauthorizedException {
        if (currentUser == null) {
            throw new UnauthorizedException();
        }
        redisClient.newPost(currentUser, postForm.getContent(), postForm.getImageUrl());
    }

    @PreDestroy
    public void destroy() {
        redisClient.close();
    }
}
