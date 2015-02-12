Contributing
============
First off, welcome to the Kuwait & Me community! We sincerely thank you for deciding to contribute.

All contributions are handled mostly through GitHub. So to make a contribution, create a GitHub account, fork the repository and start working on your own copy. When you are done, submit a pull request to us and we will start to review it. Read this [guide](https://guides.github.com/activities/forking/) for more information.

If you don't have a GitHub account, you can send an email with your changes to me@steven.pw

Once your contribution is reviewed and accepted, we will merge it with the main repository and have your name written in the [AUTHORS](AUTHORS.md) file.

If you are submitting a piece of code, then we recommend following the coding standards below. If you are submitting something that is not code (like a design, such as a logo) then you don't have to follow any standards.


Coding Standards
----------------
We don't strictly enforce these coding standards, but good code represents the quality of work you have done and will help others go through your code more easily.

* Leave documentation/comments as much as possible. At the very least, they must start with a comment block describing what they do. For example here is an excerpt for a php function.
	```php
	/**
	 * Increases the given number by 1
	 *
	 * @param  int $num        The number to increase.
	 * @return int
	 */
	public function increase($num) {
		return $num + 1;
	}
	```

* Comment code with double slashes, Write documentation within block comments.
	```php
	/* This function is suppa cool */
	too_cool();

	/* that's why we have to get rid of this one */
	// cool();
	```

* Each line should try to not exceed more than 80 characters.

* Use 2-space indentation for HTML code, 4-width tabs for everything else. This way, there is consistency with the 80 characters-per-line limit, while at the same time making code more readable.

* Follow the external coding standards otherwise. We recommend the ones below, although you don't have to do go through them. Just make sure that your code is beautiful and easy to go through.
	* [Google's Javascript style guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
	* [Google's HTML/CSS style guide](https://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml)
	* [Pear's PHP style guide](http://pear.php.net/manual/en/standards.control.php)


That's all
----------
Go ahead and start working! We are glad that you are with us in this exciting journey and we wish you best of luck!