package org.dynatrace.microblog.dto;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SerializedPost extends Post {

	private final UUID serialId;

	public SerializedPost(
			@JsonProperty("username") String username,
			@JsonProperty("body") String body,
			@JsonProperty("imageUrl") String imageUrl,
			@JsonProperty("timestamp") Date timestamp,
			@JsonProperty("serialId") UUID serialId) {
		super(username, body, imageUrl, timestamp);
		this.serialId = serialId;
	}

	public UUID getSerialId() {
		return serialId;
	}

}
