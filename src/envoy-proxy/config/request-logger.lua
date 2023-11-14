local request_logger = {}

function request_logger.log_payload(handle)
    local payload = ""
    for chunk in handle:bodyChunks() do
      local chunk_length = chunk:length()
      if (chunk_length > 0) then
        payload = payload .. chunk:getBytes(0, chunk_length)
      end
    end
    payload = tostring(payload)
    handle:streamInfo():dynamicMetadata():set("envoy.filters.http.lua.request-filter", "payload", payload)
    return payload
end

return request_logger
