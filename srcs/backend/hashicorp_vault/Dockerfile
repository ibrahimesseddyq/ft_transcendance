FROM hashicorp/vault:1.18
RUN apk update && apk upgrade 

RUN mkdir -p /vault/config /vault/data

COPY vault.hcl /vault/config/vault.hcl 


EXPOSE 8200

ENTRYPOINT [ "vault" ]
CMD ["server", "-config=/vault/config/vault.hcl"]
