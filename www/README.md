# www
This folder contains the markdown files that make up the flagbase website ([flagbase.com](https://flagbase.com)). Please note that it does not contain all pages on the website and is only a partial subset of the contents that are available on our website.

### Directory structure
* **_app_**: app to preview what content will look like on flagbase.com
* **content/blog**: blog posts ~ announcements, feature releases, engineering decisions etc.
* **content/dev**: documents related to our development practices, project plans & roadmaps, architectural decisions, changelogs
* **content/docs**: product related guides / tutorials

### Running the site locally
For debugging purposes, you can run a minimal version of the website.

You can preview the website using docker & docker-compose, using the following command:
```sh
$ docker-compose up
```

### Building the site locally
```sh
$ docker-compose run www yarn build
```



