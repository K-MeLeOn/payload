/**
* JetBrains Space Automation
* This Kotlin script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Build PayloadCMS docker image") {
  requirements {
    workerType = WorkerTypes.SPACE_CLOUD_UBUNTU_LTS_LARGE
    os {
      type = OSType.Linux
    }
  }  

  host("Build and push the Docker image") {
    shellScript {
      content = """
        # Install latest docker (https://www.docker.com/blog/multi-arch-build-what-about-travis)
        sudo rm -rf /var/lib/apt/lists/*
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository \"deb [arch=arm64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) edge\"
        sudo apt-get update
        sudo apt-get -y -o Dpkg::Options::=\"--force-confnew\" install docker-ce
        mkdir -vp ~/.docker/cli-plugins/
        curl --silent -L \"https://github.com/docker/buildx/releases/download/v0.5.1/buildx-v0.5.1.linux-amd64\" > ~/.docker/cli-plugins/docker-buildx
        chmod a+x ~/.docker/cli-plugins/docker-buildx
        docker buildx create --use
        docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
        docker buildx inspect --bootstrap
      """
	}
    
    dockerBuildPush {
      // Docker context, by default, project root
      // context = "docker"
      platform = "linux/arm64"
      extraArgsForBuildCommand = listOf("--network host")
      // path to Dockerfile relative to project root
      // if 'file' is not specified, Docker will look for it in 'context'/Dockerfile
      file = "images/production/ContainerfileCustom"
      labels["vendor"] = "payloadcms"
      labels["arch"] = "arm64"

      val spaceRepo = "nl-c.registry.jetbrains.space/p/main/arm64/payload"
      // image tags for 'docker push'
      tags {
        +"$spaceRepo:1.0.${"$"}JB_SPACE_EXECUTION_NUMBER"
        +"$spaceRepo:latest"
      }
    }
  }
}