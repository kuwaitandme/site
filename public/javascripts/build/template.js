(function() {
window["template"] = window["template"] || {};

window["template"]["about"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<h1>The Site</h1>\n<p>\n  Kuwait &amp; Me is a free online classified site, which means it is a site\n  where you can publish classifieds just like how you would publish classifieds\n  in a newspaper but for free.\n</p>\n<p>\n  Because Kuwait &amp; Me is an online service you can add images/maps/videos\n  to your classified and reach a wide audience with the help of the site and\n  its mobile app.\n</p>\n<p>\n  The purpose for the site is create a better economy in Kuwait while at the\n  same time trying to promote a sharing community. Having classifieds efficiently\n  organized and easily accessible allows people to easily sell their things\n  instead of disposing them and also allowing other people to find\n  things that they want at second-hand prices. With the site, people finally get a\n  chance to advertise their products without having to pay anything.\n</p>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["contact"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h1 lang-html="page.contact.title" class="columns"></h1>\n  <p lang-html="page.contact.hint1" class="columns"></p>\n  <p lang-html="page.contact.hint2" class="columns"></p>\n</div>\n<form class="columns">\n  <div class="row collapse">\n    <div class="small-2 medium-1 columns"><span class="prefix">@</span></div>\n    <div class="small-10 medium-11 columns">\n      <input type="email" name="email" required="required" lang-placeholder="page.contact.email"/>\n    </div>\n  </div>\n  <div class="row collapse">\n    <textarea name="message" required="required" lang-placeholder="page.contact.message"></textarea>\n  </div>\n  <div class="row collapse">\n    <div class="gcaptcha"></div>\n    <input type="submit" lang-value="page.contact.submit" class="submit"/>\n    <ul class="messages"></ul>\n  </div>\n</form>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["landing"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="landing-section">\n  <section id="search-form">\n    <div id="landing-logo"><img src="/images/kme-logo-tagline.png"/></div>\n    <form action="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified" itemprop="potentialAction" itemscope="itemscope" itemtype="http://schema.orgAction">\n      <meta itemprop="target" content="https://kuwaitandme.com/' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified?keywords={keywords}"/>\n      <input type="text" itemprop="query-input" name="keywords" lang-placeholder="page.landing.search" class="search-bar"/>\n      <button type="submit" class="search-button">&#xf002;</button>\n    </form>\n  </section>\n</div>\n<div id="landing-categories"></div>\n<div id="landing-featured-cl">\n  <div class="lang">\n    <h4 lang-html="page.landing.classifieds"></h4>\n  </div>\n  <div class="classifiedList"></div>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["account/credits"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h3 class="columns">You have <span class="credit-counter">#</span> credits</h3>\n  <p class="columns">Making a classified urgent requires 10 credits.<br/>Promoting a classified requires 50 credits.<br/>Posting more than 1 classified per day requires 5 credits<br/>Extending the life of a classified by a week requires 5 credits<br/>Extending the life of a classified by a month requires 15 credits</p>\n</div>\n<div class="row">\n  <div class="medium-4 columns">\n    <ul class="pricing-table">\n      <li class="title">20 Credits</li>\n      <li class="price">500 fils/c</li>\n      <li class="description">Total: 10 KWD</li>\n      <li class="bullet-item">Mark upto 2 classifieds as urgent</li>\n      <li class="bullet-item">Post upto 5 classifieds in a day</li>\n      <li class="bullet-item">Unable to promote any classifieds</li>\n      <li data-credits=\'20\' class="cta-button"><a class="button">Buy now</a></li>\n    </ul>\n  </div>\n  <div class="medium-4 columns">\n    <ul class="pricing-table">\n      <li class="title">50 Credits</li>\n      <li class="price">400 fils/c</li>\n      <li class="description">Total: 20 KWD</li>\n      <li class="bullet-item">Mark upto 5 classifieds as urgent</li>\n      <li class="bullet-item">Post upto 10 classifieds in a day</li>\n      <li class="bullet-item">Promote upto 1 classified</li>\n      <li data-credits=\'50\' class="cta-button"><a class="button">Buy now</a></li>\n    </ul>\n  </div>\n  <div class="medium-4 columns">\n    <ul class="pricing-table">\n      <li class="title">100 Credits</li>\n      <li class="price">300 fils/c</li>\n      <li class="description">Total: 30 KWD</li>\n      <li class="bullet-item">Mark upto 10 classifieds as urgent</li>\n      <li class="bullet-item">Post upto 100 classifieds in a day</li>\n      <li class="bullet-item">Promote upto 2 classifieds</li>\n      <li data-credits=\'100\' class="cta-button"><a class="button">Buy now</a></li>\n    </ul>\n  </div>\n  <div id="payment-modal-container"></div>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["account/index"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="account-container" class="row">\n  <div class="block medium-4 columns"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/post" data-view="">\n      <div class="content">\n        <div class="title">Post a classified</div>\n      </div></a></div>\n  <div class="block medium-4 columns"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/account/manage" data-view="">\n      <div class="content">\n        <div class="title">Manage your classifieds</div>\n      </div></a></div>\n</section>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["account/manage"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="classifiedList"></div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["account/profile"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<h1 class="font-title text-center padding">This page will be coming soon!</h1>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["auth/forgot"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="auth-title">Reset your password</div>\n<form method="POST">\n  <section>\n    <div>\n      <input type="email" name="email" placeholder="your email" required="required" id="auth-username"/>\n    </div>\n    <div>\n      <input type="submit" value="Reset your password" class="submit"/>\n    </div>\n  </section>\n  <div class="captcha-container">\n    <div class="g-recaptcha"></div>\n  </div>\n</form>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["auth/guest"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<h1>You need to be logged in to publish a classified!</h1>\n<p>So here\'s what you can do</p><a href="/guest/post" data-view="guest-post">\n  <div class="guest-post box">\n    <div class="icon">&#xf21b;</div>\n    <div class="title">Post as a guest</div>\n  </div></a><a href="/auth/login" data-view="auth-login">\n  <div class="login-post box">\n    <div class="icon">&#xf007;</div>\n    <div class="title">Login into your account</div>\n  </div></a><a href="/auth/signup" data-view="auth-signup">\n  <div class="signup-post box">\n    <div class="icon">&#xf234;</div>\n    <div class="title">Signup for a new account</div>\n  </div></a>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["auth/login"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row small-12">\n  <form id="login-form">\n    <div class="row">\n      <div class="small-12 columns">\n        <div lang-html="page.auth.login.title" class="auth-title">Login</div>\n      </div>\n    </div>\n    <div class="row input-row">\n      <div class="small-12 columns error">\n        <input type="email" name="username" required="required" lang-placeholder="page.auth.login.username" id="auth-username"/><small class="error"></small>\n      </div>\n    </div>\n    <div class="row input-row">\n      <div class="small-12 columns error">\n        <input type="password" name="password" required="required" lang-placeholder="page.auth.login.password" id="auth-password"/><small class="error"></small>\n      </div>\n    </div>\n    <div class="row">\n      <div class="medium-7 medium-offset-5 columns">\n        <input type="submit" lang-value="page.auth.login.submit" class="submit"/>\n      </div>\n    </div>\n    <div id="ajax-spinner"><img src="/images/loader.gif"/></div>\n  </form>\n  <div id="social-login" class="row collapse">\n    <div class="small-4 columns facebook"><a href="/api/auth/facebook">&#xf09a;</a></div>\n    <div class="small-4 columns google-plus"><a href="/api/auth/google-plus">&#xf0d5;</a></div>\n    <div class="small-4 columns twitter"><a href="/api/auth/twitter">&#xf099;</a></div>\n  </div>\n  <ul id="auth-messages"></ul>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["auth/reset"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="auth-title">Reset your password</div>\n<form method="POST">\n  <section>\n    <div>\n      <input type="password" name="password" placeholder="password" required="required" id="auth-password1"/>\n      <input type="password" name="repassword" placeholder="re-enter password" required="required" id="auth-password2"/>\n    </div>\n    <div>\n      <input type="submit" value="Reset your password" class="submit"/>\n    </div>\n  </section>\n  <div class="captcha-container">\n    <div class="g-recaptcha"></div>\n  </div>\n</form>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["auth/signup"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row small-12">\n  <div id="signup-form">\n    <div class="row collapse">\n      <div class="small-12 columns">\n        <div lang-html="page.auth.signup.title" class="auth-title"></div>\n      </div>\n    </div>\n    <div class="row input-row collapse">\n      <div class="small-12 columns error">\n        <input type="text" name="fullname" lang-placeholder="page.auth.signup.name" required="required" id="auth-fullname"/><small class="error"></small>\n      </div>\n    </div>\n    <div class="row input-row collapse">\n      <div class="small-12 columns error">\n        <input type="email" name="username" lang-placeholder="page.auth.signup.email" required="required" id="auth-username"/><small class="error"></small>\n      </div>\n    </div>\n    <div class="row input-row collapse">\n      <div class="small-12 columns error">\n        <input type="password" name="username" lang-placeholder="page.auth.signup.password" required="required" id="auth-password"/><small class="error"></small>\n      </div>\n    </div>\n    <div class="row input-row collapse">\n      <div class="small-12 columns error">\n        <input type="password" name="password" lang-placeholder="page.auth.signup.repassword" required="required" id="auth-repassword"/><small class="error"></small>\n      </div>\n    </div>\n    <div id="submit-div" class="row collapse hide">\n      <div class="medium-7 medium-offset-5 columns">\n        <input type="submit" lang-value="page.auth.signup.submit" class="submit"/>\n      </div>\n    </div>\n    <div id="ajax-spinner"><img src="/images/loader.gif"/></div>\n  </div>\n  <div id="social-login" class="row collapse">\n    <div class="small-4 columns facebook"><a href="/api/auth/facebook">&#xf09a;</a></div>\n    <div class="small-4 columns google-plus"><a href="/api/auth/google-plus">&#xf0d5;</a></div>\n    <div class="small-4 columns twitter"><a href="/api/auth/twitter">&#xf099;</a></div>\n  </div>\n  <div class="gcaptcha"></div>\n  <ul id="auth-messages"></ul>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/finish"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="row">\n  <section class="page small-11 large-10 small-centered columns">\n    <div class="row">\n      <h2 class="columns">Awesome! Your classified is now up and running!</h2>\n      <p class="columns">\n        Your classified has been successfully uploaded and\n        ';
 if(obj.isGuest) { ;
__p += '\n        has been sent for review by our moderators.\n        ';
 } else { ;
__p += '\n        is now online.\n        ';
 } ;
__p += '\n        &nbsp;It will be online for 30 days after which it will automatically expire and be hidden from search results.\n      </p>';
 if(obj.isGuest) { ;
__p += '\n      <p class="columns">Since you posted as a guest, you will have to use this link <a href="#" id="authLink"></a> to delete/edit your classified.</p>';
 } ;
__p += '\n      <p class="columns">You can help bring some attention to your classified by sharing it on your social networks.</p>\n    </div>\n    <div class="row">\n      <div class="columns">\n        <ul id="social-links" class="small-block-grid-1 medium-block-grid-3">\n          <li><a href="#" class="facebook social row">\n              <div class="icon small-3 columns">&#xf09a;</div>\n              <div class="text small-9 columns">Share on Facebook</div></a></li>\n          <li><a href="#" class="twitter social row">\n              <div class="icon small-3 columns">&#xf099;</div>\n              <div class="text small-9 columns">Tweet on Twitter</div></a></li>\n          <li><a href="#" class="gplus social row">\n              <div class="icon small-3 columns">&#xf0d5;</div>\n              <div class="text small-9 columns">Share on Google+</div></a></li>\n          <li>\n            <div class="button submit small-12"><a id="finishLink" href="" data-view="data-view">View your classified</a></div>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class="seperator"></div>\n    <div id="shared-message" class="row">\n      <h3 class="columns">Your classified is promoted!</h3>\n      <p class="columns">Thanks so much for spreading the love! We have promoted your classified as a token of our apprecition :)</p>\n    </div>\n    <div id="unshared-message" class="row">\n      <h3 class="columns">Promote with a share!</h3>\n      <p class="columns">\n        We love doing beautiful things for you! Show us some love back and we\n        will return the favour by <b>promoting your classified onto the\n        front-page</b> and on top of search results.\n      </p>\n      <p class="columns">\n        All you have to do is simply share the site in your social network by\n        clicking on the button below\n      </p>\n      <div class="columns medium-4 end">\n        <div id="promoteLink" class="button submit">Promote with a share</div>\n      </div>\n    </div>\n  </section>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<form class="row">\n  <section id="page-begin" class="page small-centered columns"></section>\n  <div class="seperator"></div>\n  <section id="page-info" class="page small-centered columns"></section>\n  <div class="seperator"></div>\n  <section id="page-details" class="page small-centered columns"></section>\n  <div class="seperator"></div>\n  <section id="page-images" class="page small-centered columns"></section>\n  <div class="seperator"></div>\n  <section id="page-maps" class="page small-centered columns"></section>\n  <div class="seperator"></div>\n  <section id="page-submit" class="page small-centered columns"></section>\n  <section class="page small-centered columns">\n    <div id="ajax-spinner" class="row"><img src="/images/loader.gif"/></div>\n  </section>\n</form>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="classifiedList"></div>\n<div id="filterbox"></div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/single"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="admin-single"></div>\n<ul id="single-messages"></ul>\n<div id="classified-container">\n  <div class="ajax-spinner"><img src="/images/loader.gif"/></div>\n</div>\n<div class="row">\n  <div class="columns c-disclaimer"><b lang-html="page.csingle.disclaimer-t"></b>&nbsp;<span lang-html="page.csingle.disclaimer"></span></div>\n</div>\n<div id="promptModal" data-reveal="" aria-hidden="true" role="dialog" class="reveal-modal">\n  <h3>Please give your reason for <span>action</span> this classified</h3>\n  <div class="row collapse">\n    <textarea name="message" required="required" placeholder="Your reason"></textarea>\n  </div>\n  <div class="row collapse">\n    <div class="gcaptcha"></div>\n    <button class="submit">Submit</button>\n    <ul class="messages"></ul>\n  </div><a aria-label="Close" class="close-reveal-modal">&times;</a>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/admin-single"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(superEditable) { ;
__p += '\n<div data-action="publish" lang-html="admin.single.publish" class="action"></div>\n<div data-action="reject" lang-html="admin.single.reject" class="action"></div>\n<div data-action="ban" lang-html="admin.single.ban" class="action"></div>\n<div data-action="promote" lang-html="admin.single.promote" class="action"></div>\n<div data-action="demote" lang-html="admin.single.demote" class="action"></div>';
 } ;
__p += '\n';
 if(editable) { ;
__p += '\n<div data-action="archive" lang-html="admin.single.archive" class="action"></div>';
 } ;
__p += '\n<div data-action="edit" lang-html="admin.single.edit" class="action"></div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/category-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<ul class="categories-list">';
 _.each(obj.categories, function(cat) { ;
__p += '\n  <li>\n    <div class="container">\n      <div class="image cat-sprite ' +
((__t = ( cat.classname )) == null ? '' : __t) +
'">\n        <h1 class="title">' +
((__t = ( cat.name )) == null ? '' : __t) +
'</h1>\n      </div>\n      <div class="total-count">' +
((__t = ( cat.count )) == null ? '' : __t) +
' classifieds</div>\n      <div class="children">';
 _.each(cat.children, function(child) { ;
__p += '\n        <div class="child">\n          <h2><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/' +
((__t = ( cat.slug )) == null ? '' : __t) +
'/' +
((__t = ( child.slug )) == null ? '' : __t) +
'" data-view="data-view">' +
((__t = ( child.name )) == null ? '' : __t) +
'</a></h2>\n          <div class="count">' +
((__t = ( child.count )) == null ? '' : __t) +
'</div>\n        </div>';
 }) ;
__p += '\n        <div class="child">\n          <h3><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/' +
((__t = ( cat.slug )) == null ? '' : __t) +
'" data-view="data-view" lang-html="comp.category.viewall"></a></h3>\n          <div class="count">' +
((__t = ( cat.count )) == null ? '' : __t) +
'</div>\n        </div>\n      </div>\n    </div>\n  </li>';
 }) ;
__p += '\n</ul>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/classified-list-single"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n';

var classes = "";
if(!obj.image) classes = "no-thumb ";
if(obj.perks) {
  if(perks.urgent) classes += "perk-urgent ";
  if(perks.promoted) classes += "perk-promoted ";
}
;
__p += '\n<li class="classified ' +
((__t = ( classes )) == null ? '' : __t) +
'"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/' +
((__t = ( _id )) == null ? '' : __t) +
'" data-view="classified-single">\n    <div class="container">';
 if(perks.urgent) { ;
__p += '\n      <div class="urgent-banner">Urgent</div>';
 } ;
__p += '\n      ';
 if(obj.image) { ;
__p += '\n      <div style="background: ' +
((__t = ( image.color )) == null ? '' : __t) +
'" class="thumb"><img src="/uploads/thumb/' +
((__t = ( image.file )) == null ? '' : __t) +
'" alt="' +
((__t = ( title )) == null ? '' : __t) +
'"/></div>';
 } ;
__p += '\n      <div class="c-info">\n        <h1 class="c-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h1>\n        <div class="c-meta row collapse"><b class="columns small-6">' +
((__t = ( price )) == null ? '' : __t) +
'</b><span class="columns small-6">' +
((__t = ( created )) == null ? '' : __t) +
'</span></div>\n      </div>';

      var cl="", message="";
      switch(status) {
       case 0: cl="warn";  message="Awaiting Moderation"; break;
       case 1: cl="";      message="Active"; break;
       case 2: cl="error"; message="Rejected"; break;
       case 3: cl="error"; message="Archived"; break;
       case 4: cl="error"; message="Banned"; break;
       case 5: cl="error"; message="Flagged"; break;
      }
      ;
__p += '\n      ';
 if(showStatus) { ;
__p += '\n      <div class="c-status ' +
((__t = ( cl )) == null ? '' : __t) +
'">' +
((__t = ( message )) == null ? '' : __t) +
'</div>';
 } ;
__p += '\n    </div></a></li>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/classified-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<ul class="classified-list"></ul>\n<div lang-html="comp.classifiedlist.loading" class="ajax-loading"></div>\n<div class="ajax-finish">No classified(s)</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/filterbox"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="filterbox-icon">&#xf0b0;</div>\n<div id="filterbox-modal" data-reveal="data-reveal" class="large-9 row reveal-modal">\n  <div class="keywords columns">\n    <input type="text" name="keywords" placeholder="Type your keywords here" id="filter-keywords" class="search-bar"/>\n  </div>\n  <div class="columns">\n    <div class="row">\n      <div class="columns">\n        <div class="row collapse">\n          <div class="small-5 columns">\n            <label for="right-label" class="inline">Price</label>\n          </div>\n          <div class="small-7 columns">\n            <select id="select-price" data-field="price">\n              <option>All</option>\n              <option>Free</option>\n              <option>Contact Owner</option>\n            </select>\n          </div>\n        </div>\n      </div>\n      <div class="columns">\n        <div class="row collapse">\n          <div class="small-5 columns">\n            <label for="right-label" class="inline">Type</label>\n          </div>\n          <div class="small-7 columns">\n            <select id="select-type" data-field="type">\n              <option value="">All</option>\n              <option value="0">Offering</option>\n              <option value="1">Wanted</option>\n            </select>\n          </div>\n        </div>\n      </div>\n      <div class="columns">\n        <div class="row collapse">\n          <div class="small-5 columns">\n            <label for="right-label" class="inline">Category</label>\n          </div>\n          <div class="small-7 columns">\n            <select id="select-category">\n              <option value="" disabled="disabled" lang-html="page.cform.details.category.choose"></option>\n            </select>\n          </div>\n          <div id="child-row" class="small-7 columns hide">\n            <select id="select-subcategory">\n              <option value="" disabled="disabled">Choose a sub-category</option>\n            </select>\n          </div>\n        </div>\n      </div>\n      <div class="columns">\n        <div class="row collapse">\n          <div class="small-5 columns">\n            <label for="right-label" class="inline">Location</label>\n          </div>\n          <div class="small-7 columns">\n            <select id="select-location">\n              <option value="" disabled="disabled" selected="selected" lang-html="page.cform.details.location.select"></option>\n              <option value="" lang-html="page.cform.details.location.select-none"></option>\n            </select>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <button class="submit">Save filters</button>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="header-search">\n  <form>\n    <input placeholder="search ..." name="keywords" type="text"/>\n  </form>\n  <div id="search-close" class="icon">&#xf00d;</div>\n  <div id="search-submit" class="icon">&#xf002;</div>\n</div>\n<nav id="mobile-nav" class="hide-for-large-up hide-when-searching">\n  <div id="mobile-icon"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/" data-view="data-view"><img src="/images/header-logo.png"/></a></div>\n  <ul>\n    <li class="left icon search-trigger"><a>&#xf002;</a></li>\n    <li id="nav-grabber">&#xf0c9;</li>\n  </ul>\n  <div id="subheader">\n    <ul class="lang">\n      <li class="nav-item"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/" data-view="data-view" lang-html="header.home"></a></li>\n      <li class="nav-item"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified" data-view="data-view" lang-html="header.csearch"></a></li>\n      <li class="main-item hide-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/guest/post" data-view="data-view" lang-html="header.cpost"></a></li>\n      <li class="main-item show-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/post" data-view="data-view" lang-html="header.cpost"></a></li>\n      <li class="nav-item hide-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/login" data-view="data-view" lang-html="header.login"></a></li>\n      <li class="nav-item hide-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/signup" data-view="data-view" lang-html="header.signup"></a></li>\n      <li class="main-item show-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/account" data-view="data-view" lang-html="header.manage"></a></li>\n      <li class="main-item show-if-loggedin"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/logout" data-view="data-view" lang-html="header.logout"></a></li>\n      <li class="main-item"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/contact" data-view="data-view" lang-html="header.contact"></a></li>\n      <li class="main-item"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/about" data-view="data-view" lang-html="header.about"></a></li>\n      <li class="main-item"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/terms-privacy" lang-html="header.terms-privacy"></a></li>\n    </ul>\n  </div>\n</nav>\n<nav id="main-nav" class="show-for-large-up hide-when-searching">\n  <ul>\n    <li class="main-item left home icon"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/" data-view="data-view">&#xf015;</a></li>\n    <li class="main-item left search-trigger icon"><a>&#xf002;</a></li>\n    <li class="main-item settings icon">&#xf013;\n      <ul class="subnav hide-if-loggedin">\n        <li class="with-link"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/login" data-view="data-view" lang-html="header.login"></a></li>\n        <li class="with-link"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/signup" data-view="data-view" lang-html="header.signup"></a></li>\n      </ul>\n      <ul class="subnav show-if-loggedin">\n        <li class="user-title lang"><span lang-html="header.welcome"></span>\n          <div class="name"></div>\n        </li>\n        <li class="user-thumb"><img src=""/></li>\n        <li class="with-link lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/account" data-view="data-view" lang-html="header.view"></a></li>\n        <li class="with-link lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/logout" data-view="data-view" lang-html="header.logout"></a></li>\n      </ul>\n    </li>\n    <li class="main-item social"><a href="https://www.facebook.com/KuwaitandME" class="facebook">&#xf09a;</a></li>\n    <li class="main-item social"><a href="https://www.google.com/+Kuwaitandmeclassifieds" class="googleplus">&#xf0d5;</a></li>\n    <li class="main-item social"><a href="https://twitter.com/kuwaitandme" class="twitter">&#xf099;</a></li>\n    <li class="main-item social"><a href="https://www.youtube.com/channel/UCRd6d6Tcya8JBwnNB8MFo5A" class="youtube">&#xf16a;</a></li>\n    <li class="main-item social"><a href="https://instagram.com/kuwaitandme/" class="instagram">&#xf16d;</a></li>\n  </ul>\n</nav>\n<ul id="sub-nav" class="show-for-large-up">\n  <li class="lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified" data-view="classified-search" lang-html="header.csearch"></a></li>\n  <li class="hide-if-loggedin lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/guest/post" data-view="guest-post" lang-html="header.cpost"></a></li>\n  <li class="show-if-loggedin lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/classified/post" data-view="classified-post" lang-html="header.cpost"></a></li>\n  <li class="nav-item hide-if-loggedin lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/login" data-view="auth-login" lang-html="header.login"></a></li>\n  <li class="nav-item hide-if-loggedin lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/auth/signup" data-view="auth-signup" lang-html="header.signup"></a></li>\n  <li class="show-if-loggedin lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/account" data-view="account-index" lang-html="header.manage"></a></li>\n  <li class="lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/contact" data-view="contact" lang-html="header.contact"></a></li>\n  <li class="lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/about" data-view="about" lang-html="header.about"></a></li>\n  <li class="lang"><a href="' +
((__t = ( lang.href )) == null ? '' : __t) +
'/terms-privacy" lang-html="header.terms-privacy"></a></li>\n</ul>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/payment-modal"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="payment-modal" data-reveal="" aria-labelledby="firstModalTitle" aria-hidden="true" role="dialog" class="reveal-modal">\n  <div class="row collapse">\n    <form>\n      <div class="card-wrapper large-6 columns"></div>\n      <div class="large-6 columns">\n        <div class="row collapse">\n          <div class="small-12 columns">\n            <input type="text" name="name" placeholder="Full Name"/>\n          </div>\n          <div class="small-12 columns">\n            <input type="text" name="number" placeholder="Card Number"/>\n          </div>\n          <div class="small-6 columns">\n            <input type="text" name="expiry" placeholder="MM/YY"/>\n          </div>\n          <div class="small-6 columns">\n            <input type="text" name="cvc" placeholder="CVC"/>\n          </div>\n        </div>\n      </div>\n    </form>\n    <div class="columns">\n      <h2 id="firstModalTitle">Buy <span class="buycredit-count">##</span> credits</h2>\n      <p>\n        You are about to buy <span class="buycredit-count">##</span> credits. Please fill in your credit card details\n        above. Your payment will be secured by <a href="https://www.2checkout.com/">2checkout.com</a> and the site\n        will not store any credit card information.\n      </p>\n      <p>\n        Please note that your payment will take place in USD. Using fixed rates, <span class="kwd"></span> is\n        <span class=\'usd-converted\'>$33.28</span>.&nbsp;<b>We will charge you <span class="usd">$30</span> (<span class="usd-diff">-$3.28</span>) instead.</b>\n      </p>\n      <input type="submit" value="Process Transaction" class="submit"/>\n      <div class="ajax-spinner"><img src="/images/loader.gif"/></div>\n    </div>\n  </div><a aria-label="Close" class="close-reveal-modal">&times;</a>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/perks"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="tab">\n  <div class="tab-title">Here are some perks that can boost your audience!</div>\n  <div class="tab-perk enabled">\n    <div class="perk-title">Urgent Classified</div>\n    <div class="hint">Need to sell something urgently? We\'ll make your classified stand out and bring you more attention than regular classifieds.</div>\n    <div data-val=\'0\' class="button active">Preview</div>\n    <div data-val=\'0\' class="button cancel">Cancel</div><a href="#modal-purchase">\n      <div data-val=\'0\' class="button price">Buy for 5 KWD</div></a>\n  </div>\n  <div class="tab-perk disable">\n    <div class="perk-title">Top Classified</div>\n    <div class="hint">Need alot of attention? We\'ll make your classified stay on the top page of it\'s category for three days. Get the most attention than any other classified.</div>\n    <div data-val=\'1\' class="button active">Coming soon</div>\n  </div>\n  <section id="modal-purchase" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true" class="modal--show">\n    <div class="modal-inner">\n      <div id="panel-1" class="panel">\n        <div class="title">Buy this perk</div>\n        <div class="order">Order for <b>\'Urgent Classified\'</b> perk: 15 USD (~5 KWD)</div>\n        <div id="payment-errors"></div>\n        <form>\n          <input type="hidden" name="_csrf" value="undefined"/>\n          <input id="ccc" required="required" type="text" placeholder="Credit Card #" class="by-two"/>\n          <input id="cname" required="required" type="text" placeholder="Name as on your card" class="by-two"/>\n          <input id="cvv" required="required" type="text" placeholder="CVV code" class="by-three"/>\n          <select id="cmdate" required="required" class="by-three">\n            <option value="" disabled="disabled" selected="selected">Month</option>\n            <option value="01">01 January</option>\n            <option value="02">02 February</option>\n            <option value="03">03 March</option>\n            <option value="04">04 April</option>\n            <option value="05">05 May</option>\n            <option value="06">06 June</option>\n            <option value="07">07 July</option>\n            <option value="08">08 August</option>\n            <option value="09">09 September</option>\n            <option value="10">10 October</option>\n            <option value="11">11 November</option>\n            <option value="12">12 December</option>\n          </select>\n          <select id="cydate" required="required" class="by-three">\n            <option value="" disabled="disabled" selected="selected">Year</option>\n            <option value="15">2015</option>\n            <option value="16">2016</option>\n            <option value="17">2017</option>\n            <option value="18">2018</option>\n            <option value="19">2019</option>\n            <option value="20">2020</option>\n            <option value="21">2021</option>\n            <option value="22">2022</option>\n            <option value="23">2023</option>\n            <option value="24">2024</option>\n            <option value="25">2025</option>\n          </select>\n          <input id="caddr1" required="required" type="text" placeholder="Address Line 1"/>\n          <input id="caddr2" required="required" type="text" placeholder="Address Line 1"/>\n          <input id="cstate" required="required" type="text" placeholder="State" class="by-three"/>\n          <input id="ccity" required="required" type="text" placeholder="City" class="by-three"/>\n          <input id="czip" required="required" type="text" placeholder="Zip Code" class="by-three"/>\n          <select id="ccountry" required="required" class="by-three">\n            <option value="" disabled="disabled" selected="selected">Country</option>\n            <option value="AUS">Australia</option>\n            <option value="ALB">Albania</option>\n            <option value="DZA">Algeria</option>\n            <option value="AND">Andorra</option>\n            <option value="AGO">Angola</option>\n            <option value="AIA">Anguilla</option>\n            <option value="ATG">Antigua and Barbuda</option>\n            <option value="ARG">Argentina</option>\n            <option value="ARM">Armenia</option>\n            <option value="ABW">Aruba</option>\n            <option value="AUT">Austria</option>\n            <option value="AZE">Azerbaijan Republic</option>\n            <option value="BHS">Bahamas</option>\n            <option value="BHR">Bahrain</option>\n            <option value="BRB">Barbados</option>\n            <option value="BEL">Belgium</option>\n            <option value="BLZ">Belize</option>\n            <option value="BEN">Benin</option>\n            <option value="BMU">Bermuda</option>\n            <option value="BTN">Bhutan</option>\n            <option value="BOL">Bolivia</option>\n            <option value="BIH">Bosnia and Herzegovina</option>\n            <option value="BWA">Botswana</option>\n            <option value="BRA">Brazikul</option>\n            <option value="VGB">British Virgin Islands</option>\n            <option value="BRN">Brunei</option>\n            <option value="BGR">Bulgaria</option>\n            <option value="BFA">Burkina Faso</option>\n            <option value="BDI">Burundi</option>\n            <option value="CAN">Canada</option>\n            <option value="KHM">Cambodia</option>\n            <option value="CPV">Cape Verde</option>\n            <option value="CYM">Cayman Islands</option>\n            <option value="TCD">Chad</option>\n            <option value="CHL">Chile</option>\n            <option value="CHN">China Worldwide</option>\n            <option value="COL">Colombia</option>\n            <option value="COM">Comoros</option>\n            <option value="COK">Cook Islands</option>\n            <option value="CRI">Costa Rica</option>\n            <option value="HRV">Croatia</option>\n            <option value="CYP">Cyprus</option>\n            <option value="CZE">Czech Republic</option>\n            <option value="COD">Democratic Republic of the Congo</option>\n            <option value="DNK">Denmark</option>\n            <option value="DJI">Djibouti</option>\n            <option value="DMA">Dominica</option>\n            <option value="DOM">Dominican Republic</option>\n            <option value="ECU">Ecuador</option>\n            <option value="SLV">El Salvador</option>\n            <option value="ERI">Eritrea</option>\n            <option value="EST">Estonia</option>\n            <option value="ETH">Ethiopia</option>\n            <option value="FLK">Falkland Islands</option>\n            <option value="FRO">Faroe Islands</option>\n            <option value="FSM">Federated States of Micronesia</option>\n            <option value="FJI">Fiji</option>\n            <option value="FIN">Finland</option>\n            <option value="FRA">France</option>\n            <option value="GUF">French Guiana</option>\n            <option value="PYF">French Polynesia</option>\n            <option value="GAB">Gabon Republic</option>\n            <option value="GMB">Gambia</option>\n            <option value="DEU">Germany</option>\n            <option value="GIB">Gibraltar</option>\n            <option value="GRC">Greece</option>\n            <option value="GRL">Greenland</option>\n            <option value="GRD">Grenada</option>\n            <option value="GLP">Guadeloupe</option>\n            <option value="GTM">Guatemala</option>\n            <option value="GIN">Guinea</option>\n            <option value="GNB">Guinea Bissau</option>\n            <option value="GUY">Guyana</option>\n            <option value="HND">Honduras</option>\n            <option value="HKG">Hong Kong</option>\n            <option value="HUN">Hungary</option>\n            <option value="ISL">Iceland</option>\n            <option value="IND">India</option>\n            <option value="IDN">Indonesia</option>\n            <option value="IRL">Ireland</option>\n            <option value="ISR">Israel</option>\n            <option value="ITA">Italy</option>\n            <option value="JAM">Jamaica</option>\n            <option value="JPN">Japan</option>\n            <option value="JOR">Jordan</option>\n            <option value="KAZ">Kazakhstan</option>\n            <option value="KEN">Kenya</option>\n            <option value="KIR">Kiribati</option>\n            <option value="KWT">Kuwait</option>\n            <option value="KGZ">Kyrgyzstan</option>\n            <option value="LAO">Laos</option>\n            <option value="LVA">Latvia</option>\n            <option value="LSO">Lesotho</option>\n            <option value="LIE">Liechtenstein</option>\n            <option value="LTU">Lithuania</option>\n            <option value="LUX">Luxembourg</option>\n            <option value="MDG">Madagascar</option>\n            <option value="MWI">Malawi</option>\n            <option value="MYS">Malaysia</option>\n            <option value="MDV">Maldives</option>\n            <option value="MLI">Mali</option>\n            <option value="MLT">Malta</option>\n            <option value="MHL">Marshall Islands</option>\n            <option value="MTQ">Martinique</option>\n            <option value="MRT">Mauritania</option>\n            <option value="MUS">Mauritius</option>\n            <option value="MYT">Mayotte</option>\n            <option value="MEX">Mexico</option>\n            <option value="MNG">Mongolia</option>\n            <option value="MSR">Montserrat</option>\n            <option value="MAR">Morocco</option>\n            <option value="MOZ">Mozambique</option>\n            <option value="NAM">Namibia</option>\n            <option value="NRU">Nauru</option>\n            <option value="NPL">Nepal</option>\n            <option value="NLD">Netherlands</option>\n            <option value="ANT">Netherlands Antilles</option>\n            <option value="NCL">New Caledonia</option>\n            <option value="NZL">New Zealand</option>\n            <option value="NIC">Nicaragua</option>\n            <option value="NER">Niger</option>\n            <option value="NIU">Niue</option>\n            <option value="NFK">Norfolk Island</option>\n            <option value="NOR">Norway</option>\n            <option value="OMN">Oman</option>\n            <option value="PLW">Palau</option>\n            <option value="PAN">Panama</option>\n            <option value="PNG">Papua New Guinea</option>\n            <option value="PER">Peru</option>\n            <option value="PHL">Philippines</option>\n            <option value="PCN">Pitcairn Islands</option>\n            <option value="POL">Poland</option>\n            <option value="PRT">Portugal</option>\n            <option value="QAT">Qatar</option>\n            <option value="COD">Republic of the Congo</option>\n            <option value="REU">Reunion</option>\n            <option value="ROM">Romania</option>\n            <option value="RUS">Russia</option>\n            <option value="RWA">Rwanda</option>\n            <option value="VCT">Saint Vincent and the Grenadines</option>\n            <option value="WSM">Samoa</option>\n            <option value="SMR">San Marino</option>\n            <option value="STP">São Tomé and Príncipe</option>\n            <option value="SAU">Saudi Arabia</option>\n            <option value="SEN">Senegal</option>\n            <option value="SYC">Seychelles</option>\n            <option value="SLE">Sierra Leone</option>\n            <option value="SGP">Singapore</option>\n            <option value="SVK">Slovakia</option>\n            <option value="SVN">Slovenia</option>\n            <option value="SLB">Solomon Islands</option>\n            <option value="SOM">Somalia</option>\n            <option value="ZAF">South Africa</option>\n            <option value="KOR">South Korea</option>\n            <option value="ESP">Spain</option>\n            <option value="LKA">Sri Lanka</option>\n            <option value="SHN">St. Helena</option>\n            <option value="KNA">St. Kitts and Nevis</option>\n            <option value="LCA">St. Lucia</option>\n            <option value="SPM">St. Pierre and Miquelon</option>\n            <option value="SUR">Suriname</option>\n            <option value="SJM">Svalbard and Jan Mayen Islands</option>\n            <option value="SWZ">Swaziland</option>\n            <option value="SWE">Sweden</option>\n            <option value="CHE">Switzerland</option>\n            <option value="TWN">Taiwan</option>\n            <option value="TJK">Tajikistan</option>\n            <option value="TZA">Tanzania</option>\n            <option value="THA">Thailand</option>\n            <option value="TGO">Togo</option>\n            <option value="TON">Tonga</option>\n            <option value="TTO">Trinidad and Tobago</option>\n            <option value="TUN">Tunisia</option>\n            <option value="TUR">Turkey</option>\n            <option value="TKM">Turkmenistan</option>\n            <option value="TCA">Turks and Caicos Islands</option>\n            <option value="TUV">Tuvalu</option>\n            <option value="UGA">Uganda</option>\n            <option value="UKR">Ukraine</option>\n            <option value="ARE">United Arab Emirates</option>\n            <option value="USA">United States</option>\n            <option value="GBR">United Kingdom</option>\n            <option value="URY">Uruguay</option>\n            <option value="VUT">Vanuatu</option>\n            <option value="VAT">Vatican City State</option>\n            <option value="VEN">Venezuela</option>\n            <option value="VNM">Vietnam</option>\n            <option value="WLF">Wallis and Futuna Islands</option>\n            <option value="YEM">Yemen</option>\n            <option value="ZMB">Zambia</option>\n          </select>\n          <input id="cemail" required="required" type="email" placeholder="Email" class="by-three"/>\n          <input id="cphone" required="required" type="tel" placeholder="Phone" class="by-three"/>\n        </form>\n        <div class="button submit">Make Purchase</div>\n      </div>\n      <div id="panel-2" class="panel">\n        <div id="ajax-spinner">\n          <div class="spinner"></div>\n        </div>\n        <div class="message">Processing... Do not leave this page</div>\n      </div>\n    </div><a href="#!" title="Cancel Purchase" data-close="Close" data-dismiss="modal" class="modal-close">?</a>\n  </section>\n</div>\n<div id="classified-preview" class="tab">\n  <div class="tab-title preview">Preview</div>\n  <ul id="classified-sample"></ul>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["components/single"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="row">\n  <div class="columns">\n    <ul class="c-gallery">\n      ';
 if(images) { ;
__p += '\n       ';
 _.each(images, function(img) {  ;
__p += '\n      <li class="small-6 medium-4 large-3 image-loading"><a data-lightbox="image-1" href="/uploads/main/' +
((__t = ( img.file )) == null ? '' : __t) +
'" style="background: ' +
((__t = ( img.color )) == null ? '' : __t) +
'" class="th"><img data-src="/uploads/thumb/' +
((__t = ( img.file )) == null ? '' : __t) +
'" class="thumb"/></a></li> ';
 }); ;
__p += '\n      ';
 } ;
__p += '\n    </ul>\n  </div>\n</div>\n<section class="c-content">\n  <div class="row">\n    <div class="columns">\n      <h2 class="c-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n    </div>\n  </div>\n  <div class="row">\n    <div class="medium-8 large-9 columns">\n      <p itemprop="description" class="c-description">' +
((__t = ( description )) == null ? '' : __t) +
'</p>';
 if(contact.website) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.website"></b>&nbsp;' +
((__t = ( obj.contact.website )) == null ? '' : __t) +
'\n      </div>';
 }  ;
__p += '\n    </div>\n    <div class="medium-4 large-3 columns c-meta">\n      <div class="meta"><b lang-html="page.csingle.views"></b>&nbsp;' +
((__t = ( obj.views )) == null ? '' : __t) +
'</div>\n      <div class="meta"><b lang-html="page.csingle.type"></b>&nbsp;' +
((__t = ( obj.type )) == null ? '' : __t) +
'</div>\n      <div class="meta"><b lang-html="page.csingle.price" itemprop="priceCurrency" content="KWD"></b>&nbsp;' +
((__t = ( obj.price )) == null ? '' : __t) +
'</div>\n      <div class="meta">\n        <meta itemprop="datePublished" content="&lt;%= meta.datePublished %&gt;"/>\n        <time><b lang-html="page.csingle.created"></b>&nbsp;' +
((__t = ( created )) == null ? '' : __t) +
'</time>\n      </div>';
 if(obj.category) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.category"></b>&nbsp;\n        ';
 if(obj.childCategory) { ;
__p += '\n        ' +
((__t = ( category )) == null ? '' : __t) +
', ' +
((__t = ( childCategory )) == null ? '' : __t) +
'\n        ';
 } else { ;
__p += '\n        ' +
((__t = ( category )) == null ? '' : __t) +
'\n        ';
 } ;
__p += '\n      </div>';
 } if(contact.email) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.email"></b>&nbsp;' +
((__t = ( contact.email )) == null ? '' : __t) +
'</div>';
 } if(obj.location) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.location"></b>&nbsp;' +
((__t = ( location )) == null ? '' : __t) +
'</div>';
 } if(contact.phone) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.phone"></b>&nbsp;' +
((__t = ( contact.phone )) == null ? '' : __t) +
'</div>';
 } if(contact.address1) { ;
__p += '\n      <div class="meta"><b lang-html="page.csingle.address"></b>&nbsp;' +
((__t = ( contact.address1 )) == null ? '' : __t) +
'; ' +
((__t = ( contact.address2 )) == null ? '' : __t) +
'</div>';
 } ;
__p += '\n    </div>\n  </div>\n</section>\n<div class="page-break"></div>\n<div class="row">\n  <div class="columns">\n    <div id="map-canvas"></div>\n  </div>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/begin"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="row">';
 if(obj.hasClassified) { ;
__p += '\n  <h2 lang-html="page.cform.edit.title" class="columns"></h2>';
 } else { ;
__p += '\n  <h2 lang-html="page.cform.begin.title" class="columns"></h2>';
 }  ;
__p += '\n  <p lang-html="page.cform.begin.hint1" class="columns"></p>';
 if(obj.isGuest) { ;
__p += '\n    ';
 if(obj.hasClassified) { ;
__p += '\n  <p lang-html="page.cform.edit.guest.hint1" class="columns"></p>  ';
 } else { ;
__p += '\n  <p lang-html="page.cform.begin.guest.hint1" class="columns"></p>  ';
 }  ;
__p += '\n  <p lang-html="page.cform.begin.guest.hint2" class="columns"></p>';
 } else { ;
__p += '\n    ';
 if(obj.hasClassified) { ;
__p += '\n  <p lang-html="page.cform.edit.hint2" class="columns"></p>  ';
 } else { ;
__p += '\n  <p lang-html="page.cform.begin.hint2" class="columns"></p>  ';
 } ;
__p += '\n  ';
 } ;
__p += '\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h3 lang-html="page.cform.details.title" class="columns"></h3>\n  <div lang-html="page.cform.details.hint1" class="columns"></div>\n  <p lang-html="page.cform.details.hint2" class="columns"></p>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.label.price"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <select id="price-selector" name="price-option" required="required">\n      <option value="" disabled="disabled" selected="selected" lang-html="page.cform.details.price.select"></option>\n      <option value="0" lang-html="page.cform.details.price.free"></option>\n      <option value="-1" lang-html="page.cform.details.price.contact"></option>\n      <option value="1" lang-html="page.cform.details.price.specify"></option>\n    </select><small class="error">Please choose a price</small>\n  </div>\n  <div class="columns medium-9">\n    <div id="price-row" class="row collapse hide">\n      <div class="small-3 medium-2 columns"><span lang-html="model.price.unit" class="prefix"></span></div>\n      <div class="small-9 medium-10 columns">\n        <input id="price-field" type="text" name="price" value="0" required="required" lang-placeholder="page.cform.details.price.placeholder"/>\n      </div><small class="error">Please give a price</small>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.type.label"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <select id="ctype" name="type" required="required">\n      <option value="" disabled="disabled" selected="selected" lang-html="page.cform.details.type.select"></option>\n      <option value="0" lang-html="page.cform.details.type.offering"></option>\n      <option value="1" lang-html="page.cform.details.type.wanted"></option>\n    </select><small class="error">Please choose a type</small>\n  </div>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.category.label"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <select id="cat-selector" name="parent-category" required="required">\n      <option value="" disabled="disabled" lang-html="page.cform.details.category.choose"></option>\n    </select><small class="error">Please choose a category</small>\n  </div>\n  <div class="columns medium-9">\n    <div id="child-row" class="row collapse error hide">\n      <div class="columns">\n        <select id="childcat-selector" name="child-category">\n          <option value="" disabled="disabled">Choose a sub-category</option>\n        </select><small class="error">Please choose a sub-category</small>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.email.label">Email</label>\n  </div>\n  <div class="medium-9 columns">\n    <div class="row collapse error">\n      <div class="small-3 medium-2 columns"><span class="prefix">@</span></div>\n      <div class="small-9 medium-10 columns">\n        <input id="email" type="text" name="email" lang-placeholder="page.cform.details.email.placeholder" required="required"/><small class="error">Please give an email</small>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.phone.label"></label>\n  </div>\n  <div class="medium-9 columns">\n    <div class="row collapse">\n      <div class="small-3 medium-2 columns"><span lang-html="page.cform.details.phone.prefix" class="prefix"></span></div>\n      <div class="small-9 medium-10 columns">\n        <input id="phone" type="text" name="phone" lang-placeholder="page.cform.details.phone.placeholder"/>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.details.location.label"></label>\n  </div>\n  <div class="medium-9 columns">\n    <select id="locations" name="location">\n      <option value="" disabled="disabled" selected="selected" lang-html="page.cform.details.location.select"></option>\n      <option value="" lang-html="page.cform.details.location.select-none"></option>\n    </select>\n  </div>\n</div>\n<div class="row">\n  <div id="address1" class="columns hide">\n    <input type="text" name="address1" lang-placeholder="page.cform.details.address1"/>\n  </div>\n</div>\n<div class="row">\n  <div id="address2" class="columns hide">\n    <input type="text" name="address2" lang-placeholder="page.cform.details.address2"/>\n  </div>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/images"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h3 lang-html="page.cform.images.title" class="columns"></h3>\n  <div class="columns"><b lang-html="page.cform.images.hint1"></b></div>\n  <p lang-html="page.cform.images.hint2" class="columns"></p>\n  <p lang-html="page.cform.images.hint3" class="columns"></p>\n  <div class="columns"><b lang-html="page.cform.images.hint4"></b></div>\n</div>\n<div class="row">\n  <div class="columns">\n    <form id="image-form">\n      <div id="image-upload">\n        <div class="dz-message"><span lang-html="page.cform.images.dragdrop1" class="heading"></span><br/><span lang-html="page.cform.images.dragdrop2"></span></div>\n      </div>\n    </form>\n  </div>\n  <div class="columns">\n    <ul id="image-upload-preview"></ul>\n  </div>\n</div>\n<div class="row">\n  <p lang-html="page.cform.images.hint5" class="columns"></p>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h3 lang-html="page.cform.info.title" class="columns"></h3>\n  <div lang-html="page.cform.info.hint1" class="columns"></div>\n  <p lang-html="page.cform.info.hint2" class="columns"></p>\n</div>\n<div id="title" class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.info.label.title"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <input type="text" name="title" required="required" lang-placeholder="page.cform.info.placeholder.title"/><small class="error"></small>\n  </div>\n</div>\n<div id="description" class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.info.label.description"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <textarea name="description" required="required" lang-placeholder="page.cform.info.placeholder.description"></textarea><small class="error"></small>\n  </div>\n</div>\n<div id="website" class="row">\n  <div class="medium-3 columns">\n    <label for="right-label" lang-html="page.cform.info.label.website"></label>\n  </div>\n  <div class="medium-9 columns error">\n    <input type="text" name="website" required="required" lang-placeholder="page.cform.info.placeholder.website"/><small class="error"></small>\n  </div>\n</div>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/maps"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h2 class="columns">Help people navigate to you!</h2>\n</div>\n<div class="row">\n  <p class="columns">\n    Most people have a hard time finding their way to you. A visual map is an\n    amazing way to show them exactly where you are. We make sure that\n    Google maps works beautifully with your classified, even on mobile.\n  </p>\n  <div class="columns">Choose your location by either&nbsp;<b>dragging the pointer below&nbsp;</b>or&nbsp;<b>by clicking/tapping &nbsp;</b>the location of your meeting point.</div>\n</div>\n<div class="row">\n  <div class="columns">\n    <div id="maps-container">\n      <div id="maps-disabled-overlay">Click or tap to enable maps</div>\n      <div id="map-canvas"></div>\n    </div>\n  </div>\n</div>\n<input id="gmapX" name="gmapX" type="hidden"/>\n<input id="gmapY" name="gmapY" type="hidden"/>';

}
return __p
}})();
(function() {
window["template"] = window["template"] || {};

window["template"]["classified/post/submit"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row">\n  <h3 lang-html="page.cform.submit.title" class="columns"></h3>\n  <p lang-html="page.cform.submit.hint1" class="columns"></p>\n  <p lang-html="page.cform.submit.hint2" class="disclaimer columns"></p>\n</div>\n<div class="row">\n  <ul class="columns error-message"></ul>\n  <div class="medium-4 columns">\n    <input type="submit" lang-value="page.cform.submit.button" class="submit"/>\n  </div>\n  <div class="gcaptcha columns"></div>\n</div>';

}
return __p
}})();