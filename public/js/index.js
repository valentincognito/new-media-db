$(function () {
  //globals
  let thumbInterval, activeThumb, activeThumbSrc

  //hover events
  $('.box').mouseenter(function(){
    let index = 1
    activeThumb = $('.thumbnail-outer img', this)
    activeThumbSrc = activeThumb.attr('src')
    let base = activeThumbSrc.slice(0, -6)

    thumbInterval = setInterval(() => {
      if (index > 3)
        index = 1
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
        console.log(data.toString());
      }
    })
  })
})
