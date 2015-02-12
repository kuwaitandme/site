<div class="page-nav">
	<ul>
<?php if($showFirst) { ?>
		<li><a href="<?= $firstURL ?>">First</a></li>
		<li>&middot; &middot; &middot;</li>
<?php } ?>
<?php foreach($pages as $page) { ?>
		<li class="<?= $page["class"] ?>"><a href="<?= $page["href"] ?>"><?= $page["val"] ?></a></li>
<?php } ?>
<?php if($showLast) { ?>
		<li>&middot; &middot; &middot;</li>
		<li><a href="<?= $lastURL ?>">Last</a></li>
<?php } ?>
	</ul>
</div>