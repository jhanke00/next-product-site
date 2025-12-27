# PR Label Check

In this workflow it has been added a Pull Request label check.

It contains a bash script to get the Labels of each Pull Request sent.
Later, if any label was found, it will continue with the next step if it had.

## How to test it

A good idea would be just only add the job related to this workflow to the pull_request.yml workflow and create a PR.
Create a new branch, commit the changes, push to origin and later create a PR, go to [Github Actions](https://github.com/jhanke00/next-product-site/actions)
and see what happens.

## Considerations

Devops is not my strongest point but it always liked me so I push myself to take action on that.
I tried to follow some documentation down the internet as https://github.com/orgs/community/discussions/30923 to have some ideas and get this complete.
