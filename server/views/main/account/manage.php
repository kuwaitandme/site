<div class="classified-list">
<?php if(!$classifieds || sizeof($classifieds) == 0) { ?>
  <div class="font-title padding text-center heading-xl"><?= lang("cmanage.noclassifieds") ?></div>
<?php } else { ?>
  <ul class="row">
<?php foreach ($classifieds as $c) { ?>
    <li class="columns medium-6 large-4" data-id="<?= $c["id"] ?>">
      <div class="thumb">
      </div>
      <div class="c-info">
        <a data-view="classified/single" href="<?= lang("href") ?>/classified/single/<?= $c["id"] ?>">
          <div class="font-title heading c-title"><?= $c["title"] ?></div>
        </a>
      </div>
    </li>
<?php } ?>
  </ul>
<?php } ?>
</div>

<div id="pagenav"></div>

<!-- JS Template for each classified in the list -->
<script id="list-template" type="text/template">
  <%
    var nothumb = "";
    if(!thumbnail) nothumb = "no-thumb";
  %>
  <a href="<?= site_url('classified/single/<%= id %>') ?>">
    <li class="<%= nothumb %>">
      <div class="thumb">
        <% if(thumbnail) { %>
          <img src="<?= site_url('/uploads/thumb/<%= thumbnail %>') ?>" alt="<%= title %>"/>
        <% } %>
      </div>

      <div class="c-info">
        <div class="c-title"><%= title %></div>
        <div>
          <span class="c-meta"><%= prettydate.format(daycreated) %></span>
        </div>
          <%
            var cls="", text="";
            switch(status) {
              case "0": text = "<?= lang('post.status.aw'); ?>"; cls="yellow"; break;
              case "1": text = "<?= lang('post.status.active'); ?>"; cls="green"; break;
              case "2": text = "<?= lang('post.status.archive'); ?>"; cls="red"; break;
              case "3": text = "<?= lang('post.status.reject'); ?>"; cls="red"; break;
              case "4": text = "<?= lang('post.status.ban'); ?>";  cls="red"; break;
              default: break;
            }
          %>
        <div class="box <%= cls %>"><%= text %></div>
      </div>
    </li>
  </a>
</script>