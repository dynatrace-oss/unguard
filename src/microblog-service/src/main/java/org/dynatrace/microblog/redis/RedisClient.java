/*
 * Copyright 2023 Dynatrace LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.dynatrace.microblog.redis;

import io.opentracing.Tracer;
import io.opentracing.contrib.redis.common.TracingConfiguration;
import io.opentracing.contrib.redis.jedis3.TracingJedisPool;
import org.dynatrace.microblog.authservice.UserAuthServiceClient;
import org.dynatrace.microblog.dto.Post;
import org.dynatrace.microblog.dto.User;
import org.dynatrace.microblog.exceptions.InvalidJwtException;
import org.dynatrace.microblog.exceptions.UserNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class RedisClient {

    private static final String FOLLOWED_KEY_PREFIX = "followed";
    private static final int MAX_TIMELINE_ENTRIES = 10;

    private static final String TIMELINE_KEY = "timeline";
    private static final String POST_ID_KEY = "post_id";
    private static final String POST_KEY_PREFIX = "post";
    private static final String POSTS_KEY_PREFIX = "posts";
    private static final String FOLLOWERS_KEY_PREFIX = "followers";

    private static final int REDIS_PORT = 6379;
    public static final int POST_TIMEOUT_SECONDS = 24 * 60 * 60;

    private final JedisPool jedisPool;
    private final Logger logger = LoggerFactory.getLogger(RedisClient.class);

    private final UserAuthServiceClient userAuthServiceClient;

    public RedisClient(String host, UserAuthServiceClient userAuthServiceClient, Tracer tracer) {
        TracingConfiguration tracingConfiguration = new TracingConfiguration.Builder(tracer)
                .extensionTag("peer.address", host + ":" + REDIS_PORT)
                .build();

        jedisPool = new TracingJedisPool(host, REDIS_PORT, tracingConfiguration);
        this.userAuthServiceClient = userAuthServiceClient;
    }

    private String getCombinedKey(String keyPrefix, String value) {
        return String.format("%s:%s", keyPrefix, value);
    }

    /**
     * Creates and persists a new post with the given details
     * @param userId the user id of the author
     * @param body the text body of the post
     * @param imageUrl the optional url to any image
     * @return the post id of the newly created post
     */
    @NotNull
    public String newPost(@NotNull String userId, @NotNull String body, @Nullable String imageUrl) {
        try (Jedis jedis = jedisPool.getResource()) {
            String postId = String.valueOf(jedis.incr(POST_ID_KEY));

            Map<String, String> map = new HashMap<>();
            map.put("body", body);
            if (imageUrl != null) {
                map.put("imageUrl", imageUrl);
            }
            map.put("userId", userId);
            map.put("time", String.valueOf(new Date().getTime()));

            // create new post
            String postKey = getCombinedKey(POST_KEY_PREFIX, postId);
            jedis.hmset(postKey, map);
            jedis.expire(postKey, POST_TIMEOUT_SECONDS);

            // add to our own posts
            jedis.lpush(getCombinedKey(POSTS_KEY_PREFIX, userId), postId);

            // add to follower's timeline
            Set<String> followers = jedis.zrange(getCombinedKey(FOLLOWERS_KEY_PREFIX, userId), 0, -1);
            // also include our own timeline
            followers.add(userId);
            for (String follower : followers) {
                jedis.lpush(getCombinedKey(TIMELINE_KEY, follower), postId);
                jedis.ltrim(getCombinedKey(TIMELINE_KEY, follower), 0, MAX_TIMELINE_ENTRIES);
            }

            // add to global timeline
            jedis.lpush(TIMELINE_KEY, postId);
            jedis.ltrim(TIMELINE_KEY, 0, MAX_TIMELINE_ENTRIES);

            return postId;
        }
    }

    @NotNull
    public List<Post> getUserTimeline(String jwtToken, String userId) {
        List<String> postIds;
        try (Jedis jedis = jedisPool.getResource()) {
            // Get the timeline of the user
            postIds = jedis.lrange(getCombinedKey(TIMELINE_KEY, userId), 0, MAX_TIMELINE_ENTRIES);

            return getPosts(jwtToken, postIds, jedis);
        } catch (Exception e) {
            logger.error("Could not get user timeline", e);
            throw new RuntimeException("Could not get user timeline");
        }
    }

    @NotNull
    private List<Post> getPosts(String jwtToken, List<String> postIds, Jedis jedis) throws UserNotFoundException, InvalidJwtException, IOException {
        List<Post> posts = new ArrayList<>();
        for (String postId : postIds) {
            Post post = readAndTransformPost(jwtToken, postId, jedis);
            if (post != null) {
                posts.add(post);
            }
        }
        return posts;
    }

    /**
     * Gets a List of Posts that are authored by the user with the username specified
     *
     * @param userName username of the user
     * @param limit    maximum amount of posts returned
     * @return list of posts of the user
     */
    public List<Post> getUserPosts(String jwt, String userName, int limit) throws UserNotFoundException, IOException, InvalidJwtException {
        return getUserPostsById(jwt, this.userAuthServiceClient.getUserIdFromUsername(jwt, userName), 0, limit);
    }

    private List<Post> getUserPostsById(String jwtToken, String userId, int start, int count) {
        List<Post> posts;
        try (Jedis jedis = jedisPool.getResource()) {
            List<String> postIds = jedis.lrange(getCombinedKey(POSTS_KEY_PREFIX, userId), start, start + count);
            posts = getPosts(jwtToken, postIds, jedis);
        } catch (Exception e) {
            logger.error("Could not get posts", e);
            throw new RuntimeException("Could not get posts");
        }
        return posts;
    }

    /**
     * Gets a single post
     * @param jwtToken the token of the logged in user
     * @param postId the post id of the post to be viewed
     * @return the post
     * @throws UserNotFoundException if the given user does not exists
     * @throws IOException if the request to the user auth service fails
     * @throws InvalidJwtException if the jwt is invalid
     */
    @Nullable
    public Post getPost(String jwtToken, String postId) throws UserNotFoundException, IOException, InvalidJwtException {
        try (Jedis jedis = jedisPool.getResource()) {
            return readAndTransformPost(jwtToken, postId, jedis);
        }
    }

    @Nullable
    private Post readAndTransformPost(String jwtToken, String postId, Jedis jedis) throws UserNotFoundException, InvalidJwtException, IOException {
        Map<String, String> postMap = jedis.hgetAll(getCombinedKey(POST_KEY_PREFIX, postId));
        if (postMap.isEmpty()) {
            logger.warn("Could not get post with id {}", postId);
            return null;
        }
        String userName = this.userAuthServiceClient.getUserNameForUserId(jwtToken, postMap.get("userId"));
        String body = postMap.get("body");
        String imageUrl = postMap.get("imageUrl");
        Date timestamp = new Date(Long.parseLong(postMap.get("time")));

        return new Post(postId, userName, body, imageUrl, timestamp);
    }

    public List<Post> getTimeline(String jwtToken) {
        List<Post> posts;
        try (Jedis jedis = jedisPool.getResource()) {
            List<String> postIds = jedis.lrange(TIMELINE_KEY, 0, 50);
            posts = getPosts(jwtToken, postIds, jedis);
        } catch (Exception e) {
            logger.error("Could not get timeline", e);
            throw new RuntimeException("Could not get timeline");
        }
        return posts;
    }

    public void follow(String currentUserId, String userId) {
        Long followedAddedSuccess;
        Long followerAddedSuccess;
        try (Jedis jedis = jedisPool.getResource()) {
            // add the newly followed account to the user's followed accounts
            followedAddedSuccess = jedis.zadd(
                    getCombinedKey(FOLLOWED_KEY_PREFIX, currentUserId),
                    new Date().getTime(),
                    userId);
            // add the current user to the followed account's followers
            followerAddedSuccess = jedis.zadd(
                    getCombinedKey(FOLLOWERS_KEY_PREFIX, userId),
                    new Date().getTime(),
                    currentUserId);
        } catch (Exception e) {
            logger.error("Could not get User id for username", e);
            throw new RuntimeException("Could not get User id for username");
        }

        if (followedAddedSuccess == 1 && followerAddedSuccess == 1) {
            logger.info("User with id {} followed user with id {}", currentUserId, userId);
        } else if (followedAddedSuccess == 0 && followerAddedSuccess == 0) {
            logger.info("User with id {} already was following user with id {}", currentUserId, userId);
        } else {
            logger.error("Inconsistent database state for followed/following.");
        }
    }

    public Collection<User> getFollowers(String jwtToken, String userId) {
        Set<User> followers;
        try (Jedis jedis = jedisPool.getResource()) {
            Set<String> followerIds = jedis.zrange("followers:" + userId, 0, -1);
            if (followerIds.isEmpty()) {
                logger.info("No followers for {}", userId);
                return Collections.emptyList();
            }
            followers = new HashSet<>();
            for (String followerId : followerIds) {
                User user = new User(Integer.parseInt(followerId), this.userAuthServiceClient.getUserNameForUserId(jwtToken, followerId));
                followers.add(user);
                logger.info(String.format("follower of %s = %s", userId, user.getUserName()));
            }
        } catch (Exception e) {
            logger.error("Could not get followers from redis", e);
            throw new RuntimeException("Could not get followers from redis");
        }
        return followers;
    }

    // UNUSED CURRENTLY
    public Collection<User> getFollowersInCommon(String jwtToken, String userId, String otherUserId) {
        Set<User> commonFollowers;
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.zinterstore("common",
                    getCombinedKey(FOLLOWERS_KEY_PREFIX, userId),
                    getCombinedKey(FOLLOWERS_KEY_PREFIX, otherUserId));
            Set<String> followers = jedis.zrange("common", 0, -1);
            if (followers.isEmpty()) {
                return Collections.emptyList();
            }
            commonFollowers = new HashSet<>();
            for (String followerId : followers) {
                User user = new User(Integer.parseInt(followerId), this.userAuthServiceClient.getUserNameForUserId(jwtToken, followerId));
                commonFollowers.add(user);
                logger.info(String.format("common followers of %s and %s = %s", userId, otherUserId, user.getUserName()));
            }
        } catch (Exception e) {
            logger.error("Could not get followers in common from redis", e);
            throw new RuntimeException("Could not get followers in common from redis");
        }
        return commonFollowers;
    }
}
