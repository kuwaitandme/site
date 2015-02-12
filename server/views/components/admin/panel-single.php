<section id="singleAdminPanel">
  <ul id="mobile-admin-panel" class="row text-center hide-for-large-up">
<?php if($super_editable) { ?>
    <form class="small-4 columns" method="POST">
      <input type="hidden" name="action" value="publish">
      <input type="submit" value="<?= lang("admin.single.publish") ?>">
    </form>
    <form class="small-4 columns" method="POST">
      <input type="hidden" name="action" value="reject">
      <input type="submit" value="<?= lang("admin.single.reject") ?>">
    </form>
    <form class="small-4 columns" method="POST">
      <input type="hidden" name="action" value="ban">
      <input type="submit" value="<?= lang("admin.single.ban") ?>">
    </form>
<?php } ?>
    <form class="small-4 columns" method="POST">
      <input type="hidden" name="action" value="archive">
      <input type="submit" value="<?= lang("admin.single.archive") ?>">
    </form>
    <form class="small-4 columns" method="POST">
      <input type="hidden" name="action" value="repost">
      <input type="submit" value="<?= lang("admin.single.repost") ?>">
    </form>
    <!-- Disable editing functionality for now -->
    <!-- <form action="<?= lang("href") . "/classified/edit/" . $post->id ?>" class="small-4 columns" method="GET">
      <input type="hidden" name="action" value="edit">
      <input type="submit" value="<?= lang("admin.single.edit") ?>">
    </form> -->
  </ul>
  <div id="main-admin-panel">
    <div id="mobile-admin-grabber" class="float-left item hide-for-large-up">
      <span class="font-awesome">&#xf0c9;</span>
      <span class="title"><?= lang("admin.single.admin") ?></span>
    </div>
    <div class="show-for-large-up">
<?php if($super_editable) { ?>
      <form class="float-left item large" method="POST">
        <input type="hidden" name="action" value="publish">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.publish") ?>">
        </span>
      </form>
      <form class="float-left item large" method="POST">
        <input type="hidden" name="action" value="reject">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.reject") ?>">
        </span>
      </form>
      <form class="float-left item large" method="POST">
        <input type="hidden" name="action" value="ban">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.ban") ?>">
        </span>
      </form>
<?php } ?>
      <form class="float-left item large" method="POST">
        <input type="hidden" name="action" value="archive">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.archive") ?>">
        </span>
      </form>
      <form class="float-left item large" method="POST">
        <input type="hidden" name="action" value="repost">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.repost") ?>">
        </span>
      </form>
      <!-- <form action="<?= site_url("classified/edit/" . $post->id) ?>" class="float-left item large" method="GET">
        <input type="hidden" name="action" value="edit">
        <span class="title">
          <input type="submit" value="<?= lang("admin.single.edit") ?>">
        </span>
      </form> -->
    </div>
  </div>
</section>