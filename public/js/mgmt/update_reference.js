$(function () {
  //globals
  const pathArray = window.location.pathname.split( '/' );
  const referenceId = pathArray[3];

	//click events
  $('.tag').click(function(){
    $(this).toggleClass('active')
  })

  $('.submit').click(function(){
    let categories = []
    let fields = []
    let technos = []
    let visuals = []

    $('.project-details .category.active').each(function() {
      categories.push($(this).attr('data-id'))
    })

    $('.project-details .field.active').each(function() {
      fields.push($(this).attr('data-id'))
    })

    $('.project-details .techno.active').each(function() {
      technos.push($(this).attr('data-id'))
    })

    $('.project-details .visual.active').each(function() {
      visuals.push($(this).attr('data-id'))
    })

    $.ajax({
      url: '/mgmt/update_reference',
      type: 'PUT',
      data: {
        referenceId: referenceId,
        title: $('.project-details .title').val(),
        date: $('.project-details .date').val(),
        company: $('.project-details .company').find(":selected").val(),
        categories: categories,
        fields: fields,
        technos: technos,
        visuals: visuals
      },
      success: function(data) {
        console.log(data);
        location.reload()
      }
    })
  })
})
