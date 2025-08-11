let mm;
mm = (await import("micromatch")).default

mm.isMatch("test/page_name.page.tsx", "**.page.tsx"); // true
mm.isMatch("test/page_name.page.tsx", "**.page.{tsx,jsx}"); // false
mm.isMatch("test/page_name.page.tsx", "**.page.{tsx,jsx}", {basename:true}); // true
mm.isMatch("test/page_name.page.tsx", mm.braces("**.page.{tsx,jsx}")); // false
mm.isMatch("test/page_name.page.tsx", mm.braces("**.page.{tsx,jsx}"), {basename:true}); // true
mm.isMatch("test/page_name.page.tsx", mm.braces("**.page.{tsx,jsx}", {expand:true})); // true

mm.isMatch("test/page_name.page.tsx", "**.page.*"); // false
mm.isMatch("test/page_name.page.tsx", "**.page.*", {basename:true}); // true
mm.isMatch("test/page_name.page.tsx.html", "**.page.tsx.html"); // true
mm.isMatch("test/page_name.page.tsx.html", "**.page.*.html"); // false

mm.capture("**.page.*.html", "page-name.page.tsx.html"); // [ 'page-name', 'tsx' ]
mm.capture("**.page.*.html", "test/page-name.page.js.html"); // undefined
mm.capture("**.page.*.html", "test/page-name.page.js.html", {basename:true}); // undefined
mm.capture("**.page.js.html", "test/page-name.page.js.html", {basename:true}); // [ "test/page-name" ]