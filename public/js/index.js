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
  filters.push(selectedCategories)
  filters.push(selectedTechnos)
  filters.push(selectedFields)
  filters.push(selectedVisuals)

  for (cat of filters) {
    if (cat != null) {
      for (el of cat) {
        $('.filter-list span:contains('+ el +')').addClass('active')
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

  $('.filter-menu li').click(function(){
    let idx = $('.filter-menu li').index($(this))
    $('.filter-list').hide()
    $('.filter-list').eq(idx).toggle()

    $('.filter-menu li').removeClass('active')
    $(this).addClass('active')
  })

  $('.filter-list span').click(function(){
    $(this).toggleClass('active')
  })

  $('.navigation .search').click(function(){
    let categories = []
    let technos = []
    let fields = []
    let visuals = []

    $('.filter-list.category span.active').each(function(index) {
      categories.push($(this).html())
    })
    $('.filter-list.technology span.active').each(function(index) {
      technos.push($(this).html())
    })
    $('.filter-list.field span.active').each(function(index) {
      fields.push($(this).html())
    })
    $('.filter-list.visual span.active').each(function(index) {
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
})
