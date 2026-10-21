/* 쇼핑몰 운영 가이드 공통 스크립트 (정적 페이지, 서버/DB 없음) */
(function ($) {
  "use strict";

  var D = window.GUIDE_DATA || null;

  /* ---------- 공통 UI: 사이드바 토글 / 테마 ---------- */
  $(".btn-toggle").on("click", function () {
    var $b = $("body");
    if ($b.hasClass("toggled")) {
      $b.removeClass("toggled");
      $(".sidebar-wrapper").off("mouseenter mouseleave");
    } else {
      $b.addClass("toggled");
      $(".sidebar-wrapper").hover(
        function () { $b.addClass("sidebar-hovered"); },
        function () { $b.removeClass("sidebar-hovered"); }
      );
    }
  });
  $(".sidebar-close").on("click", function () { $("body").removeClass("toggled"); });

  var savedTheme = null;
  try { savedTheme = localStorage.getItem("guide-theme"); } catch (e) { /* 저장소 사용 불가 */ }
  function applyTheme(t) {
    $("html").attr("data-bs-theme", t);
    $(".dark-mode i").text(t === "dark" ? "light_mode" : "dark_mode");
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  $(".dark-mode").on("click", function () {
    var next = $("html").attr("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("guide-theme", next); } catch (e) { /* 무시 */ }
  });

  $(window).on("scroll", function () {
    $(".top-header .navbar").toggleClass("sticky-header", $(this).scrollTop() > 60);
  });

  if (!D) {
    $("#sidenav").metisMenu();
    return;
  }

  /* ---------- 플랫폼 가이드 렌더링 ---------- */
  var M = D.meta;
  var $app = $("#app");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function itemId(g, i) { return g.id + "-" + (i + 1); }
  function plain(html) { return String(html).replace(/<[^>]+>/g, ""); }

  /* 사이드바 */
  function buildSidebar() {
    var h = '<li><a href="#home"><div class="parent-icon"><i class="material-icons-outlined">home</i></div>' +
      '<div class="menu-title">시작하기</div></a></li>';
    h += '<li class="menu-label">' + esc(M.name) + ' 메뉴</li>';
    D.groups.forEach(function (g) {
      if (g.items.length === 1) {
        h += '<li data-group="' + g.id + '"><a href="#' + g.id + '"><div class="parent-icon"><i class="material-icons-outlined">' +
          g.icon + '</i></div><div class="menu-title">' + esc(g.title) + '</div></a></li>';
        return;
      }
      h += '<li data-group="' + g.id + '"><a href="javascript:;" class="has-arrow"><div class="parent-icon"><i class="material-icons-outlined">' +
        g.icon + '</i></div><div class="menu-title">' + esc(g.title) + '</div></a><ul>';
      g.items.forEach(function (it, i) {
        h += '<li data-item="' + itemId(g, i) + '"><a href="#' + itemId(g, i) +
          '"><i class="material-icons-outlined">arrow_right</i>' + esc(it.title) + '</a></li>';
      });
      h += "</ul></li>";
    });
    h += '<li class="menu-label">바로가기</li>' +
      '<li><a href="../index.html"><div class="parent-icon"><i class="material-icons-outlined">dashboard</i></div><div class="menu-title">가이드 대시보드</div></a></li>' +
      '<li><a href="' + (D.other.url) + '"><div class="parent-icon"><i class="material-icons-outlined">swap_horiz</i></div><div class="menu-title">' + esc(D.other.name) + ' 가이드</div></a></li>' +
      '<li><a href="../../index.html"><div class="parent-icon"><i class="material-icons-outlined">pets</i></div><div class="menu-title">펫펠리아 메인</div></a></li>';
    $("#sidenav").html(h).metisMenu();
  }

  /* 홈 */
  function renderHome() {
    var h = '<div class="card rounded-4 guide-hero mb-4"><div class="card-body p-4"><div class="d-flex align-items-center gap-3">' +
      '<div class="hero-icon"><i class="material-icons-outlined">' + M.icon + '</i></div><div>' +
      '<h3 class="fw-semibold mb-1">' + esc(M.name) + ' 사용 가이드</h3><p class="mb-0 text-secondary">' + M.intro + '</p></div></div></div></div>';

    h += '<div class="row g-4 mb-4"><div class="col-12 col-xl-6"><div class="card rounded-4 h-100"><div class="card-body p-4">' +
      '<h5 class="fw-semibold mb-3">접속 정보</h5><table class="table info-table mb-3"><tbody>' +
      '<tr><th>' + esc(M.adminName) + '</th><td><a class="btn btn-sm btn-brand" target="_blank" rel="noopener" href="' + M.loginUrl +
      '"><i class="material-icons-outlined fs-6 align-middle me-1">login</i>로그인</a></td></tr>' +
      '<tr><th>' + esc(M.storeLabel) + '</th><td><a href="' + M.storeUrl + '" target="_blank" rel="noopener">' + esc(M.storeUrl) + '</a></td></tr>' +
      '</tbody></table><p class="guide-notice mb-0">' + M.notice + '</p></div></div></div>';

    h += '<div class="col-12 col-xl-6"><div class="card rounded-4 h-100"><div class="card-body p-4"><h5 class="fw-semibold mb-2">등록된 상품</h5>';
    M.products.forEach(function (p) {
      h += '<div class="product-row"><img src="' + p.img + '" alt="' + esc(p.name) + '"><div class="flex-grow-1"><div class="fw-semibold">' + esc(p.name) +
        '</div></div><a class="btn btn-sm btn-outline-brand" target="_blank" rel="noopener" href="' + p.url + '">상품 보기</a></div>';
    });
    h += "</div></div></div></div>";

    h += '<div class="row g-4 mb-4"><div class="col-12 col-xl-6"><div class="card rounded-4 h-100"><div class="card-body p-4">' +
      '<h5 class="fw-semibold mb-2">매일 하는 운영 체크리스트</h5><ul class="check-list">';
    M.checklist.forEach(function (c) {
      h += '<li><i class="material-icons-outlined">check_circle</i><div>' + c + "</div></li>";
    });
    h += '</ul></div></div></div><div class="col-12 col-xl-6"><div class="card rounded-4 h-100"><div class="card-body p-4">' +
      '<h5 class="fw-semibold mb-2">처음이신가요?</h5><ol class="step-list">';
    M.start.forEach(function (s) { h += "<li>" + s + "</li>"; });
    h += "</ol></div></div></div></div>";

    h += '<h5 class="fw-semibold mb-3">메뉴별 사용 안내</h5><div class="row g-3">';
    D.groups.forEach(function (g) {
      var list = g.items.length > 1 ? g.items.map(function (it) { return "<li>" + esc(it.title) + "</li>"; }).join("") : "";
      h += '<div class="col-12 col-md-6 col-xl-4"><a class="card rounded-4 menu-card" href="#' + g.id + '"><div class="card-body p-3">' +
        '<div class="d-flex align-items-center gap-3 mb-2"><div class="menu-card-icon"><i class="material-icons-outlined">' + g.icon + '</i></div>' +
        '<h6 class="fw-semibold mb-0">' + esc(g.title) + '</h6></div><p class="mb-2 small text-secondary">' + esc(g.desc) + "</p>" +
        (list ? '<ul class="menu-card-list">' + list + "</ul>" : "") + "</div></a></div>";
    });
    h += "</div>";
    return h;
  }

  /* 메뉴 그룹 */
  function renderGroup(g, openId) {
    var h = '<div class="card rounded-4 guide-hero mb-4"><div class="card-body p-4"><div class="d-flex align-items-center gap-3">' +
      '<div class="hero-icon"><i class="material-icons-outlined">' + g.icon + '</i></div><div><h3 class="fw-semibold mb-1">' + esc(g.title) +
      '</h3><p class="mb-0 text-secondary">' + esc(g.desc) + "</p></div></div></div></div>";
    h += '<div class="accordion" id="items-' + g.id + '">';
    g.items.forEach(function (it, i) {
      var id = itemId(g, i);
      var open = openId ? openId === id : i === 0;
      h += '<div class="accordion-item" id="item-' + id + '"><h2 class="accordion-header"><button class="accordion-button' + (open ? "" : " collapsed") +
        ' fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#c-' + id + '">' + esc(it.title) + '</button></h2>' +
        '<div id="c-' + id + '" class="accordion-collapse collapse' + (open ? " show" : "") + '"><div class="accordion-body p-4">';
      h += '<span class="badge path-badge rounded-pill mb-3">' + esc(it.path || (M.menuRoot + " > " + g.title + " > " + it.title)) + "</span>";
      h += '<p class="mb-3">' + it.desc + "</p>";
      if (it.steps && it.steps.length) {
        h += '<h6 class="fw-semibold mb-2">이렇게 사용하세요</h6><ol class="step-list mb-3">';
        it.steps.forEach(function (s) { h += "<li>" + s + "</li>"; });
        h += "</ol>";
      }
      if (it.tips && it.tips.length) {
        h += '<div class="tip-box mb-3"><div class="fw-semibold mb-1"><i class="material-icons-outlined fs-6 align-middle me-1">lightbulb</i>알아두세요</div><ul>';
        it.tips.forEach(function (t) { h += "<li>" + t + "</li>"; });
        h += "</ul></div>";
      }
      if (it.warn) {
        h += '<div class="alert alert-warning mb-3"><i class="material-icons-outlined fs-6 align-middle me-1">warning</i>' + it.warn + "</div>";
      }
      if (it.links && it.links.length) {
        it.links.forEach(function (l) {
          h += '<a class="btn btn-sm btn-brand me-2" target="_blank" rel="noopener" href="' + l.url + '">' + esc(l.label) + "</a>";
        });
      }
      h += "</div></div></div>";
    });
    h += "</div>";
    return h;
  }

  /* 라우팅 */
  function findRoute(hash) {
    var key = (hash || "").replace(/^#/, "") || "home";
    if (key === "home") return { type: "home" };
    for (var gi = 0; gi < D.groups.length; gi++) {
      var g = D.groups[gi];
      if (g.id === key) return { type: "group", g: g };
      for (var i = 0; i < g.items.length; i++) {
        if (itemId(g, i) === key) return { type: "group", g: g, open: key };
      }
    }
    return { type: "home" };
  }

  function crumb(parts) {
    var h = '<div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3"><div class="breadcrumb-title pe-3">' + esc(M.name) +
      '</div><div class="ps-3"><nav aria-label="breadcrumb"><ol class="breadcrumb mb-0 p-0"><li class="breadcrumb-item"><a href="#home"><i class="bx bx-home-alt"></i></a></li>';
    parts.forEach(function (p, i) {
      h += '<li class="breadcrumb-item' + (i === parts.length - 1 ? ' active" aria-current="page' : "") + '">' + esc(p) + "</li>";
    });
    return h + "</ol></nav></div></div>";
  }

  function markActive(route) {
    var $nav = $("#sidenav");
    $nav.find("li.mm-active").removeClass("mm-active");
    if (route.type === "home") return;
    var $grp = $nav.find('li[data-group="' + route.g.id + '"]');
    $grp.addClass("mm-active");
    if (route.open) {
      $grp.children("ul").addClass("mm-show");
      $grp.children("a").attr("aria-expanded", "true");
      $nav.find('li[data-item="' + route.open + '"]').addClass("mm-active");
    }
  }

  function render() {
    var route = findRoute(location.hash);
    var body;
    if (route.type === "home") {
      body = crumb(["시작하기"]) + renderHome();
      document.title = M.name + " 사용 가이드 | 펫펠리아";
    } else {
      body = crumb([route.g.title]) + renderGroup(route.g, route.open);
      document.title = route.g.title + " | " + M.name + " 가이드";
    }
    $app.html(body + '<p class="guide-notice text-center mt-4">' + M.footer + "</p>");
    markActive(route);
    $("body").removeClass("toggled");
    if (route.open) {
      var el = document.getElementById("item-" + route.open);
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }

  /* 검색 */
  var index = [];
  D.groups.forEach(function (g) {
    g.items.forEach(function (it, i) {
      var text = [g.title, it.title, it.desc].concat(it.steps || [], it.tips || []).join(" ");
      index.push({ id: itemId(g, i), group: g.title, title: it.title, text: plain(text).toLowerCase() });
    });
  });
  var $results = $("#searchResults");
  $("#guideSearch").on("input focus", function () {
    var q = $.trim($(this).val()).toLowerCase();
    if (!q) { $results.removeClass("show").empty(); return; }
    var hits = index.filter(function (r) { return r.text.indexOf(q) !== -1; }).slice(0, 8);
    var h = hits.length ? hits.map(function (r) {
      return '<a href="#' + r.id + '">' + esc(r.title) + "<small>" + esc(r.group) + "</small></a>";
    }).join("") : '<div class="empty">검색 결과가 없습니다.</div>';
    $results.html(h).addClass("show");
  });
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".guide-search").length) $results.removeClass("show");
  });
  $results.on("click", "a", function () { $results.removeClass("show"); $("#guideSearch").val(""); });

  buildSidebar();
  window.addEventListener("hashchange", render);
  render();
})(jQuery);
