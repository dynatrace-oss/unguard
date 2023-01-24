--[[
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--]]

local H = {}
local os = require('os')
local string = require('string')

-- decode spaces ('+') and hex-encoded characters
local function urldecode(s)
    local hex2char = function(x)
        return string.char(tonumber(x, 16))
    end
    return s:gsub('+', ' '):gsub('%%(%x%x)', hex2char)
end

-- parse the query parameters of an URL
local function parseparams(url)
    local params = {}
    for k, v in url:gmatch('([^&=?]+)=([^&=?]+)') do
        params[k] = urldecode(v)
    end
    return params
end

-- perform a health check via curl
function H.check(url)
    local path = parseparams(url)["path"]
    -- the following line is VULNERABLE to COMMAND INJECTION ATTACKS
    local code = os.execute("curl -m 15 -I " .. path)
    return code
end

return setmetatable(H, {
    __call = function(self, url)
        return self.check(url)
    end
})
