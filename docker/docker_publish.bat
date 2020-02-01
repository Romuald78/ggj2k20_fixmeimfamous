docker login
call docker_build.bat
docker tag rphstudio-fixme:latest registry.admin.rphstudio.net/rphstudio-fixme:latest
docker push registry.admin.rphstudio.net/rphstudio-fixme:latest