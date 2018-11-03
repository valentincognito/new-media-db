$(function () {
  //globals
  let thumbInterval, activeThumb, activeThumbSrc

  let svgCloseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M291.4 256L483.9 63.4c9.8-9.8 9.8-25.6 0-35.4-9.8-9.8-25.6-9.8-35.4 0L256 220.6 63.4 28.1c-9.8-9.8-25.6-9.8-35.4 0-9.8 9.8-9.8 25.6 0 35.4L220.6 256 28.1 448.6c-9.8 9.8-9.8 25.6 0 35.4 4.9 4.9 11.3 7.3 17.7 7.3s12.8-2.4 17.7-7.3L256 291.4 448.6 484c4.9 4.9 11.3 7.3 17.7 7.3s12.8-2.4 17.7-7.3c9.8-9.8 9.8-25.6 0-35.4L291.4 256z"/></svg>'

  let url = new URL(window.location.href)
  let currentPage = Number(url.searchParams.get("page"))
  let pageCount = Number($('.pagination .page-count').html())

  let selectedCategories = url.searchParams.get("categories")
  let selectedTechnos = url.searchParams.get("technos")
  let selectedFields = url.searchParams.get("fields")
  let selectedVisuals = url.searchParams.get("visuals")
  let selectedTitle = url.searchParams.get("title")

  if (selectedCategories) selectedCategories = selectedCategories.split("+")
  if (selectedTechnos) selectedTechnos = selectedTechnos.split("+")
  if (selectedFields) selectedFields = selectedFields.split("+")
  if (selectedVisuals) selectedVisuals = selectedVisuals.split("+")

  let filters = []
  filters.push({label: selectedCategories, parent: 'category'})
  filters.push({label: selectedTechnos, parent: 'technology'})
  filters.push({label: selectedFields, parent: 'field'})
  filters.push({label: selectedVisuals, parent: 'visual'})

  //add the research by title tag
  if (selectedTitle) {
    $('.selected-filters-list').show()
    $('.selected-filters-list .inner .tag-list').append('<span class="tag title" data-content="'+ selectedTitle +'">"'+ selectedTitle + '"'+ svgCloseIcon +'</span>')
  }

  for (cat of filters) {
    if (cat.label != null) {
      $('.selected-filters-list').show()
      for (el of cat.label) {
        $('.filter-list .tags:contains('+ el +')').addClass('active')
        $('.selected-filters-list .inner .tag-list').append('<span class="tag '+ cat.parent +'" data-content="'+ el +'">'+ el + svgCloseIcon +'</span>')
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

  //search by title on enter key
  $('.title-search input').on('keyup', function (e) {
    if (e.keyCode == 13) {
      let title = $(this).val()
      url.searchParams.set("title", title)
      url.searchParams.set("page", 1)
      location.href = url
    }
  })

  $('.title-search-submit').click(function(){
    let title = $('.title-search input').val()
    url.searchParams.set("title", title)
    url.searchParams.set("page", 1)
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
      $('.selected-filters-list .inner .tag-list').append('<span class="tag" data-content="'+ $(this).html() +'" style="background:'+tagColor+'">'+ $(this).html() + svgCloseIcon + '</span>')
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

  //remove filters on click
  $('body').on('click', '.selected-filters-list .tag-list .tag', function() {
    if ( $(this).hasClass('title') ) {
      url.searchParams.set("page", 1)
      url.searchParams.delete("title")
      location.href = url
    }
    $('.filter-list .tags:contains('+ $(this).attr('data-content') +')').removeClass('active')
    $(this).remove()
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

    if (categories.length > 0){
       url.searchParams.set("categories", categories.join('+'))
     }else{
       url.searchParams.delete("categories")
     }
    if (technos.length > 0){
       url.searchParams.set("technos", technos.join('+'))
     }else{
       url.searchParams.delete("technos")
     }
    if (fields.length > 0){
       url.searchParams.set("fields", fields.join('+'))
     }else{
       url.searchParams.delete("fields")
     }
    if (visuals.length > 0){
       url.searchParams.set("visuals", visuals.join('+'))
     }else{
       url.searchParams.delete("visuals")
     }

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

    showNotification('link saved in your clipboard !')
  })

  function showNotification(text){
    $('.notification').empty().html(text)
    $('.notification').addClass('open')
    setTimeout(() => {
      $('.notification').removeClass('open')
    }, 2000);
  }
})
