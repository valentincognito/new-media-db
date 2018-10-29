$(function () {
  //globals
  let thumbInterval, activeThumb, activeThumbSrc

  let url = new URL(window.location.href)
  let currentPage = Number(url.searchParams.get("page"))
  let pageCount = Number($('.pagination .page-count').html())

  let selectedCategories = url.searchParams.get("categories")
  let selectedTechnos = url.searchParams.get("technos")
  let selectedFields = url.searchParams.get("fields")
  let selectedVisuals = url.searchParams.get("visuals")

  if (selectedCategories) selectedCategories = selectedCategories.split("+")
  if (selectedTechnos) selectedTechnos = selectedTechnos.split("+")
  if (selectedFields) selectedFields = selectedFields.split("+")
  if (selectedVisuals) selectedVisuals = selectedVisuals.split("+")

  let filters = []
  filters.push({label: selectedCategories, parent: 'category'})
  filters.push({label: selectedTechnos, parent: 'technology'})
  filters.push({label: selectedFields, parent: 'field'})
  filters.push({label: selectedVisuals, parent: 'visual'})

  for (cat of filters) {
    if (cat.label != null) {
      $('.selected-filters-list').show()
      for (el of cat.label) {
        $('.filter-list .tags:contains('+ el +')').addClass('active')
        $('.selected-filters-list .inner .tag-list').append('<span class="tag '+ cat.parent +'">'+ el +'</span>')
      }
    }
  }

  if (!currentPage) currentPage = 1
  $('.pagination .number.active').html(currentPage)

  let prevString
  (currentPage != 1) ? prevString = "< prev" : prevString = ""
  $('.pagination .prev').html(prevString)

  let nextString
  (currentPage < pageCount) ? nextString = "next >" : nextString = ""
  $('.pagination .next').html(nextString)

  //hover events
  $('.box').mouseenter(function(){
    let index = 2
    activeThumb = $('.thumbnail-outer img', this)
    if (activeThumb != undefined) {
      activeThumbSrc = activeThumb.attr('src')
      let base = activeThumbSrc.slice(0, -6)

      thumbInterval = setInterval(() => {
        if (index > 3) index = 1
        activeThumb.attr('src', base + '0'+ index +'.jpg')
        index++
      }, 800)
    }
  }).mouseleave(function() {
    if (activeThumb != undefined) {
      activeThumb.attr('src', activeThumbSrc)
      clearInterval(thumbInterval)
    }
  })

	//click events
  $(document).click(function(e) {
    if ( $(e.target).closest('.navigation').length === 0 ) {
      $('.filter-menu li').removeClass('active')
      $('.filter-list').hide()
    }
  })

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

  //search by title on enter key
  $('.title-search input').on('keyup', function (e) {
    if (e.keyCode == 13) {
      let title = $(this).val()
      url.searchParams.set("title", title)
      location.href = url
    }
  })

  $('.title-search-submit').click(function(){
    let title = $('.title-search input').val()
    url.searchParams.set("title", title)
    location.href = url
  })

  $('.filter-menu li').click(function(){
    let idx = $('.filter-menu li').index($(this))
    $('.filter-list').hide()
    $('.filter-list').eq(idx).toggle()

    $('.filter-menu li').removeClass('active')
    $(this).addClass('active')
  })

  $('.filter-list .tags').click(function(){
    $(this).toggleClass('active')

    //add tags dynamically
    if ($(this).hasClass('active')) {
      let tagColor = $(this).closest('.filter-list').css('background-color')
      $('.selected-filters-list .inner .tag-list').append('<span class="tag" style="background:'+tagColor+'">'+ $(this).html() +'</span>')
    }else{
      $('.selected-filters-list .inner .tag-list .tag:contains('+ $(this).html() +')').remove()
    }

    //show / hide UI if tags are selected
    if ($('.selected-filters-list .tag').length > 0) {
      $('.selected-filters-list').show()
    }else{
      $('.selected-filters-list').hide()
    }
  })

  $('.selected-filters-list .filter-search').click(function(){
    let categories = []
    let technos = []
    let fields = []
    let visuals = []

    $('.filter-list.category .tags.active').each(function(index) {
      categories.push($(this).html())
    })
    $('.filter-list.technology .tags.active').each(function(index) {
      technos.push($(this).html())
    })
    $('.filter-list.field .tags.active').each(function(index) {
      fields.push($(this).html())
    })
    $('.filter-list.visual .tags.active').each(function(index) {
      visuals.push($(this).html())
    })

    url.searchParams.set("categories", categories.join('+'))
    url.searchParams.set("technos", technos.join('+'))
    url.searchParams.set("fields", fields.join('+'))
    url.searchParams.set("visuals", visuals.join('+'))

    url.searchParams.set("page", 1)
    location.href = url
  })

  $('.pagination .next').click(function(){
    url.searchParams.set("page", currentPage + 1)
    location.href = url
  })

  $('.pagination .prev').click(function(){
    url.searchParams.set("page", currentPage - 1)
    location.href = url
  })

  $('.box .copy-link').click(function(){
    let tempInput = document.createElement('INPUT')
    $('body').append(tempInput)
    tempInput.setAttribute('value', $(this).next().attr('href'))
    tempInput.select()
    document.execCommand('copy')
    tempInput.remove()

    showNotification('link save in your clipboard !')
  })

  function showNotification(text){
    $('.notification').empty().html(text)
    $('.notification').addClass('open')
    setTimeout(() => {
      $('.notification').removeClass('open')
    }, 2000);
  }
})
