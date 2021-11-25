# What is this for?

The deploy from github repo to github pages is NOT triggered unless any HTML file is changed.  
I can see why it is done, but sometimes my changes only affect javascript files.  
So, we have this file: deploy_trigger/index.html . Release script puts random numbers into the file every time it is executed. That way, every release-push will actually be followed by deploy.  
