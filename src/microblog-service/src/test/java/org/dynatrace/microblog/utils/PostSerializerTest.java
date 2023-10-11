package org.dynatrace.microblog.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Date;
import java.util.UUID;

import org.dynatrace.microblog.dto.SerializedPost;
import org.junit.jupiter.api.Test;

class PostSerializerTest {

	private final PostSerializer postSerializer = new PostSerializer();

	@Test
	void serializePost_ReturnsTrue_WhenObjectCouldBeDeserialized() {
		assertThat(postSerializer.serializePost(
				new SerializedPost("1", "username", "body", "imageURL", new Date(), UUID.randomUUID())))
				.isTrue();
	}
}
