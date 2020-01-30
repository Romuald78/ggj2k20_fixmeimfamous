docker login
call docker_build.bat
docker tag rphstudio-croco:latest registry.admin.rphstudio.net/rphstudio-croco:latest
docker push registry.admin.rphstudio.net/rphstudio-croco:latest