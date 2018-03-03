# Contributors

> Every work is great only because of its contributors. 

Thanks goes to these ❤️ wonderful people who made this possible.

> We made the internet and it made us vulnerable. We fought and we won. - OpenGenus


Welcome to a brand new world of algorithms. We are revolutionizing the way people interact with code.
The success of our vision depends on you. Even a small contribution helps. All forms of contributions are highly welcomed and valued.
You can contribute by writing code, documentation, making Quark friendly and many others. There are endless possibilities.
You can suggest your own ideas and start working on them. There is an endless scope of contributions and several minor yet impactful changes are required. Feel free to discuss with us regarding anything and we will love to help you out.
We aim to make the contribution process as easy and enjoyable as possible. Join OpenGenus and explore the new world.

These are some basic guidelines which you can refer before starting on Quark.

## Issue Reporting

The issues are used to track both bugs filed by users and specific work items for developers. Some of the basic facts to remember while reporting an issue :
* Try to file one issue per problem observed. 
* Please specify a valid title (e.g. "Bubble Sort algorithm is not accessible" instead of "Quark does not work") 
* Provide more details about the issue like any link to the problem, location in the code, screenshot, error messages or any other source that could make the issue more clear.

**Note** : Before you start working on an issue, kindly state what you are doing specifically in the concerned issue or create a new issue. If multiple users end up making the pull request for the same task, the person who informed everyone in the issue first will be given preference.

## Contributing Guidelines

Below is an overview of how to contribute code to Quark. The basic workflow is as follows:

1. Fork
1. Create feature branch
1. Make changes
1. Push changes to your fork/branch
1. Create pull request
1. Code review and automated testing
1. Merge into master

### Prerequisites
* Git client
* GitHub account

### 1. Fork
To fork the repository you need to have a GitHub account. Once you have an account you can click the fork button on top. Now that you have your fork you need to clone it (replace `{username}` with your GitHub username) using
```
git clone https://github.com/{username}/quark.git
cd quark
```
It is useful to have the upstream repository registered as well using
```
git remote add upstream https://github.com/OpenGenus/quark.git
```

### 2. Create feature branch
We always work with feature branches. For example, to create and switch to branch, use:
```
git checkout -b {branch_name}
```
and replace `{branch_name}` with a meaningful name that describes your feature or change.
For instance, if you are working on adding a button, a good branch name would be `add-button`.

### 3. Make changes
Now that you have a new branch you can edit/create/delete files. Follow the standard Git workflow to stage and locally commit your changes -- there are lots of guides that explain Git.

If the branch contains lot of small commits, you can squash the commits also so that you have a clear and concise git history that clearly and easily documents the changes done and the reasons. You can use Git's rebase option for this.

### 5. Push changes to your fork/branch
After all tests pass, push the changes to your fork/branch on GitHub:
```
git push origin {branch_name}
```

### 6. Create pull request
Create a pull request on GitHub for your feature branch. The code will then be reviewed and tested further by our contributors and maintainers.

### 7. Code review 
After creating pull request, your code will be reviewed by the maintainers to test for its correctness and compatibility.

### 8. Merge into master
If all goes well, your changes will be merged into the main repository and there you become a contributor to Quark.

Hope you are enjoy journey with OpenGenus.