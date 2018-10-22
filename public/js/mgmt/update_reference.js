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
    let thumbnails = []

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

    $('.project-details .thumbnail').each(function() {
      thumbnails.push($(this).val())
    })

    $.ajax({
      url: '/mgmt/update_reference',
      type: 'PUT',
      data: {
        referenceId: referenceId,
        title: $('.project-details .title').val(),
        description: $('.project-details .description').val(),
        url: $('.project-details .url').val(),
        date: $('.project-details .date').val(),
        thumbnails: thumbnails,
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
