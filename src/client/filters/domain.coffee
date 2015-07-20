exports = module.exports = -> (url="") ->

    # find & remove protocol (http, ftp, etc.) and get domain
    if url.indexOf("://") > -1 then domain = url.split('/')[2];
    else domain = url.split('/')[0]

    # find & remove port number
    domain = domain.split(":")[0]

    # find & remove www
    if url.indexOf("www.") > -1 then domain = domain.split("www.")[1]
    else domain

