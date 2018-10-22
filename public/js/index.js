$(function () {
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
