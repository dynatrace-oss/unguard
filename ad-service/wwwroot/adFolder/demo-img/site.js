/* vulnerable since this file (like every other /wwwroot file) can be overwritten
 * with the sharpcompress vulnerability */

window.onload = function() {
  // change the ads periodical reload
  setTimeout(() => {
    document.location.reload();
  }, 5000);
}
