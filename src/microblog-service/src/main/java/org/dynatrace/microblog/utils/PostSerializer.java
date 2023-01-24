package org.dynatrace.microblog.utils;

import java.io.IOException;

import org.dynatrace.microblog.dto.SerializedPost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * The purpose of this class is to showcase vulnerable function usage of the cluster (no posts get really serialized).
 */
@Controller
public class PostSerializer {

	private final Logger logger = LoggerFactory.getLogger(PostSerializer.class);

	/**
	 * Calls the vulnerable function "SubTypeValidator.validateSubType" of the "com.fasterxml.jackson.databind" library by
	 * serializing and deserializing the given {@link SerializedPost}. Causes the vulnerability "Deserialization of untrusted data".
	 * We don't check if the method is really called, it has to be done manually e.g. by creating a breakpoint
	 * in "validateSubType" (version: '2.8.11.3') and run the test in debug mode.
	 *
	 * @param serializedPost the post to serialize, must be a subType of {@link org.dynatrace.microblog.dto.Post}.
	 * @return true if an object with a polymorphic subtype was successfully deserialized.
	 */
	//Deprecated method call is necessary, we'd like to call a vulnerable function here.
	public boolean serializePost(final SerializedPost serializedPost) {
		String vulnerableFunction = "com.fasterxml.jackson.databind.jsontype.impl.SubTypeValidator.validateSubType";
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping();
		try {
			String writtenSerializedPost = mapper.writeValueAsString(serializedPost);

			if(mapper.readValue(writtenSerializedPost, SerializedPost.class) != null) {
				logger.info(String.format("Vulnerable function %s was called.", vulnerableFunction));
				return true;
			}
		} catch (JsonProcessingException e) {
			logger.warn(String.format("Exception while trying to call vulnerable function %s ", vulnerableFunction), e);
		} catch (IOException e) {
			logger.warn(String.format("Exception while trying to deserialize Object %s ", serializedPost), e);
		}
		return false;
	}
}
