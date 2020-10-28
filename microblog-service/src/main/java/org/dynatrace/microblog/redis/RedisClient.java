package org.dynatrace.microblog.redis;

import io.opentracing.Tracer;
import io.opentracing.contrib.redis.common.TracingConfiguration;
import io.opentracing.contrib.redis.jedis3.TracingJedis;
import org.dynatrace.microblog.dto.Post;
import org.dynatrace.microblog.dto.User;
import org.dynatrace.microblog.exceptions.InvalidUserException;
import org.dynatrace.microblog.exceptions.UserAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import redis.clients.jedis.Jedis;

import java.util.*;

public class RedisClient {

    private static final String FOLLOWED_KEY_PREFIX = "followed";
    private final String TIMELINE_KEY = "timeline";
    private final String POST_ID_KEY = "post_id";
    private final String POST_KEY_PREFIX = "post";
    private final String POSTS_KEY_PREFIX = "posts";
    private final String USERS_KEY = "users";
    private final String FOLLOWERS_KEY_PREFIX = "followers";

    private final String USERNAME_FIELD = "userName";

    private final Jedis jedis;
    private final Logger logger = LoggerFactory.getLogger(RedisClient.class);

    public RedisClient(String host, Tracer tracer) {
        TracingConfiguration tracingConfiguration = new TracingConfiguration.Builder(tracer).build();

        jedis = new TracingJedis(host, tracingConfiguration);
    }

    private String getCombinedKey(String keyPrefix, String value) {
        return String.format("%s:%s", keyPrefix, value);
    }

    /**
     * Close the redis connection
     */
    public void close() {
        jedis.close();
    }

    public void newPost(String username, String body, String imageUrl) throws InvalidUserException {
        String userId = getUserIdFromUsername(username);
        if (userId == null) {
            throw new InvalidUserException();
        }
        newPostWithUserId(userId, body, imageUrl);
    }

    private void newPostWithUserId(@NonNull String userId, @NonNull String body, @Nullable String imageUrl) {
        String postId = String.valueOf(jedis.incr(POST_ID_KEY));

        Map<String, String> map = new HashMap<>();
        map.put("body", body);
        if(imageUrl != null) {
            map.put("imageUrl", imageUrl);
        }
        map.put("userId", String.valueOf(userId));
        map.put("time", String.valueOf(new Date().getTime()));

        // create new post
        jedis.hmset(getCombinedKey(POST_KEY_PREFIX, postId), map);

        // add to our own posts
        jedis.lpush(getCombinedKey(POSTS_KEY_PREFIX, userId), postId);

        // add to follower's timeline
        Set<String> followers = jedis.zrange(getCombinedKey(FOLLOWERS_KEY_PREFIX, userId), 0, -1);
        // also include our own timeline
        followers.add(userId);
        for (String follower : followers) {
            jedis.lpush(getCombinedKey(TIMELINE_KEY, follower), postId);
        }

        // add to global timeline
        jedis.lpush(TIMELINE_KEY, postId);
        jedis.ltrim(TIMELINE_KEY, 0, 10);
    }

    public List<Post> getUserTimeline(String userId) {
        // Get the timeline of the user
        List<String> postIds = jedis.lrange(getCombinedKey(TIMELINE_KEY, userId), 0, -1);
        List<Post> posts = new ArrayList<>();
        for (String postId : postIds) {
            posts.add(getPostById(postId));
        }
        return posts;
    }

    /**
     * Gets a List of Posts that are authored by the user with the username specified
     * @param userName username of the user
     * @param limit maximum amount of posts returned
     * @return list of posts of the user
     */
    public List<Post> getUserPosts(String userName, int limit) {
        return getUserPostsById(getUserIdFromUsername(userName), 0, limit);
    }

    private List<Post> getUserPostsById(String userId, int start, int count) {
        List<String> postIds = jedis.lrange(getCombinedKey(POSTS_KEY_PREFIX, userId), start, start + count);
        List<Post> posts = new ArrayList<>();
        for (String postId : postIds) {
            posts.add(getPostById(postId));
        }
        return posts;
    }

    private Post getPostById(String postId) {
        Map<String, String> postMap = jedis.hgetAll(getCombinedKey(POST_KEY_PREFIX, postId));
        String userName = getUserName(postMap.get("userId"));
        String body = postMap.get("body");
        String imageUrl = postMap.get("imageUrl");
        Date timestamp = new Date(Long.parseLong(postMap.get("time")));

        return new Post(userName, body, imageUrl, timestamp);
    }

    public List<Post> getTimeline() {
        List<String> postIds = jedis.lrange(TIMELINE_KEY, 0, 50);
        List<Post> posts = new ArrayList<>();
        for (String postId : postIds) {
            posts.add(getPostById(postId));
        }
        return posts;
    }

    public String getUserName(String userId) {
        return jedis.hget(getCombinedKey(USERS_KEY, userId), USERNAME_FIELD);
    }

    public void follow(String currentUserId, String userId) {
        // add the newly followed account to the user's followed accounts
        Long followedAddedSuccess = jedis.zadd(
                getCombinedKey(FOLLOWED_KEY_PREFIX, currentUserId),
                new Date().getTime(),
                userId);
        // add the current user to the followed account's followers
        Long followerAddedSuccess = jedis.zadd(
                getCombinedKey(FOLLOWERS_KEY_PREFIX, userId),
                new Date().getTime(),
                currentUserId);

        if (followedAddedSuccess == 1 && followerAddedSuccess == 1) {
            logger.info(String.format("User with id %s followed user with id %s", currentUserId, userId));
        } else if (followedAddedSuccess == 0 && followerAddedSuccess == 0) {
            logger.info(String.format("User with id %s already was following user with id %s", currentUserId, userId));
        } else {
            logger.error("Inconsistent database state for followed/following.");
        }
    }

    @Nullable
    public String getUserIdFromUsername(@NonNull String userName) {
        return jedis.hget(USERS_KEY, userName);
    }

    /**
     * Creates a new user
     *
     * @param userName name of the user
     * @return user Id of the new user
     */
    public String newUser(String userName) throws UserAlreadyExistsException {
        if (getUserIdFromUsername(userName) != null) {
            throw new UserAlreadyExistsException();
        }
        Long userId = jedis.incr("userId");
        Map<String, String> userMap = new HashMap<>();
        userMap.put("userName", userName);

        // this userMap is for future proofing, i.e. could add profile pic, birthday etc.
        jedis.hmset(getCombinedKey(USERS_KEY, String.valueOf(userId)), userMap);

        // add to (username => id) map
        jedis.hset(USERS_KEY, userName, String.valueOf(userId));

        return String.valueOf(userId);
    }

    public Collection<User> getFollowers(String userId) {
        Set<String> followerIds = jedis.zrange("followers:" + userId, 0, -1);
        if (followerIds.isEmpty()) {
            logger.info(String.format("No followers for %s", getUserName(userId)));
            return Collections.emptyList();
        }
        Set<User> followers = new HashSet<>();
        for (String followerId : followerIds) {
            User user = new User(Integer.parseInt(followerId), getUserName(followerId));
            followers.add(user);
            logger.info(String.format("follower of %s = %s", getUserName(userId), user.getUserName()));
        }
        return followers;
    }

    // UNUSED CURRENTLY
    public Collection<User> getFollowersInCommon(String userId, String otherUserId) {
        jedis.zinterstore("common",
                getCombinedKey(FOLLOWERS_KEY_PREFIX, userId),
                getCombinedKey(FOLLOWERS_KEY_PREFIX, otherUserId));
        Set<String> followers = jedis.zrange("common", 0, -1);
        if (followers.isEmpty()) {
            return Collections.emptyList();
        }
        Set<User> commonFollowers = new HashSet<>();
        for (String followerId : followers) {
            User user = new User(Integer.parseInt(followerId), getUserName(followerId));
            commonFollowers.add(user);
            logger.info(String.format("common followers of %s and %s = %s", getUserName(userId), getUserName(otherUserId), user.getUserName()));
        }
        return commonFollowers;
    }
}
