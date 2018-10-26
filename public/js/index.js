$(function () {
  //globals
  let thumbInterval, activeThumb, activeThumbSrc

  let url = new URL(window.location.href)
  let currentPage = Number(url.searchParams.get("page"))
  let pageCount = Number( $('.pagination .page-count').html() )

  if (!currentPage) currentPage = 1

  $('.pagination .number.active').html(currentPage)

  let prevString
  (currentPage != 1) ? prevString = "prev" : prevString = ""
  $('.pagination .prev').html(prevString)

  let nextString
  (currentPage < pageCount) ? nextString = "next" : nextString = ""
  $('.pagination .next').html(nextString)


  //hover events
  $('.box').mouseenter(function(){
    let index = 1
    activeThumb = $('.thumbnail-outer img', this)
    activeThumbSrc = activeThumb.attr('src')
    let base = activeThumbSrc.slice(0, -6)

    thumbInterval = setInterval(() => {
      if (index > 3) index = 1
      activeThumb.attr('src', base + '0'+ index +'.jpg')
      index++
    }, 800);
  }).mouseleave(function() {
    activeThumb.attr('src', activeThumbSrc)
    clearInterval(thumbInterval)
  })

	//click events
  $('.box').click(function(){
    $.ajax({
      url: '/update_view_count',
      type: 'PUT',
      data: { referenceId: $(this).attr('data-id') },
      success: function(data) {
        //console.log(data.toString());
      }
    })
  })

  $('.pagination .next').click(function(){
    url.searchParams.set("page", currentPage + 1)
    location.href = url
  })

  $('.pagination .prev').click(function(){
    url.searchParams.set("page", currentPage - 1)
    location.href = url
  })
})
