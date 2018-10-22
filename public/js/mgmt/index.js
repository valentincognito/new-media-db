$(function () {
  //globals
  const pathArray = window.location.pathname.split( '/' );
  const referenceId = pathArray[3];

	//click events
  $('.new').click(function(){
    $.ajax({
      url: '/mgmt/add_reference',
      type: 'PUT',
      data: {},
      success: function(data) {
        location.href = "mgmt/update/" + data._id
      }
    })
  })
})
