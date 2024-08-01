# Really simple 2-microservice architecture

This is a really simple 2-microservice app comprised of services 'a' and 'b'.

## How to run

1. Locally:
    - first, go into the `hosts` file corresponding to your OS and insert the next entries:

    ```
    127.0.0.1	my_microservice.io
    127.0.0.1	a.my_microservice.io
    127.0.0.1	b.my_microservice.io
    ```

    - next, you'll want to start all 3 apps: the dns resolver, service 'a' and service 'b'.

        How this works is pretty simple, the dns resolver acts like the dns resolver provided by kubernetes, so we can deploy local applications and have them bound to actual subdomains/hostnames, so we don't get to use only ips (well, in our case apps are on different ports on localhost). 

        Services 'a' and 'b' are on ports 9700 and 9800 with the hostnames 'a.my_microservice.io' and 'b.my_microservice.io', respectively.

        Service 'b' returns a simple response containing the url request, the ip that the request came from, the name of the service ('b-' followed by a random string - mimicking pod name - or the Pod name, in case it runs inside of Kubernetes - but make sure you add metadata.name as POD_NAME in the Pod spec)

        Service 'a' does the same thing as 'b', but can also send a request to service 'b' in case you add a `action=doRequest` query string to the url. The body will also contain a `proxied` property with the response returned by hitting up service 'b'.

    - requests can be simple GET requests to the next urls:
      - `http://a.my_microservice.io`
      - `http://a.my_microservice.io?action=doRequest`
      - `http://b.my_microservice.io`

1. In K8s - TODO: document