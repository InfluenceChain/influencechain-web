const ACCOUNT_URL = '/account/#/center'
let COUNTRY_DEFAULT = ''
const CAPTCHA_EMAIL_TIMEOUT = 60
const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US']

const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const REG_PASSWORD = /^[A-Za-z0-9]{6,18}$/
const REG_HASH = /^#?[A-Za-z0-9-]*$/

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia (Plurinational State of)',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'China Hongkong',
  'China Macao',
  'China Taiwan',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  "Côte D'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  "Democratic People's Republic of Korea",
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran (Islamic Republic of)',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Lao People’s Democratic Republic',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia (Federated States of)',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Republic of Korea',
  'Republic of Moldova',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South &lrm;Sudan',
  'Spain',
  'Sri Lanka',
  'State of Palestine',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Tajikistan',
  'Thailand',
  'The former Yugoslav Republic of Macedonia',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom of Great Britain and Northern Ireland',
  'United Republic of Tanzania',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela (Bolivarian Republic of)',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
]

const $ = window.$
let registerTimer = null
let forgetTimer = null
let registerCountDown = 0
let forgetCountDown = 0

const DEFAULT_LANGUAGE = 'en-US'
const languageCached = window.localStorage.getItem('language')
if (languageCached && SUPPORTED_LANGUAGES.includes(languageCached)) {
  window.language = languageCached
} else {
  window.localStorage.setItem('language', DEFAULT_LANGUAGE)
  window.language = DEFAULT_LANGUAGE
}

const setLanguage = (language = DEFAULT_LANGUAGE) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    language = DEFAULT_LANGUAGE
  }
  window.localStorage.setItem('language', language)
  window.language = language
  renderWithLanguage(language)
}

const renderWithLanguage = (language = DEFAULT_LANGUAGE) => {
  if (!window.dict) return

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    language = DEFAULT_LANGUAGE
  }
  const _dict = window.dict[window.language]
  if (!_dict) return

  // Translate Normal Text
  $('[data-i18n]').each(function () {
    const key = $(this).attr('data-i18n')
    const val = _dict[key] || ''
    $(this).text(val)
  })

  // Translate Image
  $('[data-i18n-src]').each(function () {
    const key = $(this).attr('data-i18n-src')
    const val = _dict[key] || ''
    $(this).prop('src', `${val}?v=${Date.now()}`)
  })

  // Translate Placeholder
  $('[data-i18n-placeholder]').each(function () {
    const key = $(this).attr('data-i18n-placeholder')
    const val = _dict[key] || ''
    $(this).prop('placeholder', val)
  })

  // Translate Download
  $('[data-i18n-href]').each(function(){
      const key=$(this).attr('data-i18n-href');
      const val=_dict[key]||'';
      $(this).prop('href',val)
  });

  // Translate Select Default
  COUNTRY_DEFAULT = _dict['SELECT_NATIONALITY_DEFAULT']
  $('#dialog-authentication').find('select').eq(0).find('option').eq(0).text(COUNTRY_DEFAULT)
}

const init = () => {
  const $navMenu = $('#nav-menu')
  const $mainContainer = $('#main-container')
  const $sections = $('.section')
  const headerHeight = $mainContainer.offset().top
  const $btnAccount = $('#btn-account')
  let $btnPreRegister = null

  $('#copyright-year').text(new Date().getFullYear())

  let fileList = []

  function scrollToSection (id) {
    if (!REG_HASH.test(id)) return

    const target = $(id)
    if (!target) return

    const contentScrollTop = $mainContainer.scrollTop()
    const targetOffset = target.offset()
    const targetScrollTop = contentScrollTop + targetOffset.top - headerHeight
    setTimeout(() => {
      const offsetFix = 1
      $mainContainer.scrollTop(targetScrollTop + offsetFix)
    }, 0)
  }

  // Activate nav menu on load
  const locationHash = window.location.hash
  if (locationHash) {
    scrollToSection(locationHash)
  }

  // Activate nav menu on click
  $navMenu.find('li').on('click', function () {
    const target = $(this).find('a').attr('href')
    if (!target) return
    scrollToSection(target)
  })

  // Activate nav menu on scroll
  function updateNavMenu () {
    let currentSectionID = ''
    $sections.map(function () {
      const offset = $(this).offset()
      if (offset.top <= headerHeight) {
        currentSectionID = $(this).prop('id')
      }
    })
    if (!currentSectionID) {
      currentSectionID = '#section-home'
    } else {
      currentSectionID = '#' + currentSectionID
    }

    $navMenu.find('li').removeClass('active')
    $navMenu.find(`a[href="${currentSectionID}"]`).parent().addClass('active')
  }

  $($mainContainer).on('scroll', updateNavMenu)

  // Toggle Language
  const $languageSelector = $('#language-selector')
  const $currentLanguage = $languageSelector.find('.current-language')
  $currentLanguage.on('click', () => {
    $languageSelector.toggleClass('open')
  })

  const $languageListItems = $languageSelector.find('li')
  $languageListItems.each(function () {
    const language = $(this).attr('data-language')
    if (language === window.language) {
      $(this).addClass('active')
    }
  })
  $languageListItems.on('click', function () {
    $languageListItems.removeClass('active')
    $(this).addClass('active')

    const language = $(this).attr('data-language')
    setLanguage(language)
    $languageSelector.removeClass('open')
  })

  // Video Playback
  const $sectionHome = $('#section-home')
  const video = $sectionHome.find('video')[0]
  const $videoContainer = $sectionHome.find('.video-container').eq(0)
  const $videoMask = $sectionHome.find('.mask')

  // Toggle Video Playback
  $videoMask.on('click', () => {
    video.paused ? video.play() : video.pause()
  })

  // On Video Play
  $(video).on('play', () => {
    $videoContainer.find('.cover').removeClass('show')
    $videoContainer.find('.btn-play').removeClass('show')
  })

  // On Video Pause
  $(video).on('pause', () => {
    $videoContainer.find('.btn-play').addClass('show')
  })

  // On Video Stop
  $(video).on('timeUpdate', () => {
    if (video.currentTime >= video.duration) {
      video.pause()
      video.currentTime = 0
      $videoContainer.find('.cover').addClass('show')
    }
  })

  // Show Wechat QRCode
  $('#section-home').find('.presale-process footer li.wechat').on('click', () => {
    $('#dialog-wechat-qrcode').addClass('show')
    $('.dialog-mask').addClass('show')
  })

  $('#section-follow').find('li.wechat').on('click', () => {
    $('#dialog-wechat-qrcode').addClass('show')
    $('.dialog-mask').addClass('show')
  })

  const $dialogMask = $('.dialog-mask')
  const $dialogLogin = $('#dialog-login')
  const $dialogRegister = $('#dialog-register')
  const $dialogForget = $('#dialog-forget')
  const $dialogAuthentication = $('#dialog-authentication')

  function resetDialogs () {
    $('#login-email input').val('')
    $('#login-password input').val('')
    $('#login-captcha-image input').val('')
    $('#login-remember').prop('checked', false)

    $('#register-email input').val('')
    $('#register-password input').val('')
    $('#register-captcha-image input').val('')
    $('#register-captcha-email input').val('')

    $('#reset-email input').val('')
    $('#reset-captcha-image input').val('')
    $('#reset-captcha-email input').val('')
    $('#reset-password input').val('')

    $('#authentication-realname input').val('')
    $('#authentication-id-number input').val('')
    $('#authentication-country select').val('')
    $('#authentication-country .value').val('')
    $('#authentication-captcha-image input').val('')

    fileList = []
  }

  // Close Dialogs
  $('.dialog .btn-close, .dialog-mask').on('click', () => {
    $('.dialog').removeClass('show')
    $('.dialog-mask').removeClass('show')
    resetDialogs()
  })

  function getImageCaptcha () {
    return `/vercode?t=${Date.now()}`
  }

  // Captcha Image self update
  $('#login-captcha-image img, #register-captcha-image img, #reset-captcha-image img, #authentication-captcha-image img').on('click', function () {
    const captchaImage = getImageCaptcha()
    $(this).prop('src', captchaImage)
  })

  // Dialog Show/Hide
  $dialogLogin.find('.tab').eq(1).on('click', () => {
    const captchaImage = getImageCaptcha()
    $('#register-captcha-image img').prop('src', captchaImage)
    $dialogLogin.removeClass('show')
    $dialogRegister.addClass('show')
  })

  $dialogRegister.find('.tab').eq(0).on('click', () => {
    const captchaImage = getImageCaptcha()
    $('#login-captcha-image img').prop('src', captchaImage)
    $dialogRegister.removeClass('show')
    $dialogLogin.addClass('show')
  })

  $dialogLogin.find('.options a').on('click', () => {
    const captchaImage = getImageCaptcha()
    $('#reset-captcha-image img').prop('src', captchaImage)
    $dialogLogin.removeClass('show')
    $dialogForget.addClass('show')
  })

  $dialogForget.find('.options span').on('click', () => {
    const captchaImage = getImageCaptcha()
    $('#login-captcha-image img').prop('src', captchaImage)
    $dialogForget.removeClass('show')
    $dialogLogin.addClass('show')
  })

  // Toggle register helper visibility
  $dialogRegister.find('.options span').on('click', () => {
    $('#register-helper').toggleClass('show')
  })

  // Login
  $('#btn-login').on('click', () => {
    const email = $('#login-email input').val()
    const password = $('#login-password input').val()
    const captchaImage = $('#login-captcha-image input').val()

    const {
      ERROR_INVALID_EMAIL,
      ERROR_INVALID_PASSWORD,
      ERROR_INVALID_IMAGE_CAPTCHA
    } = window.dict[window.language]

    if (!email || !REG_EMAIL.test(email)) {
      window.alert(ERROR_INVALID_EMAIL)
      return
    }

    if (!password) {
      window.alert(ERROR_INVALID_PASSWORD)
      return
    }

    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    $.ajax({
      url: '/login',
      type: 'POST',
      dataType: 'json',
      data: {
        email,
        password,
        vercode: captchaImage
      }
    })
    .done(res => {
      if (res.status !== 1) {
        window.alert(res.msg)
        const captchaImage = getImageCaptcha()
        $('#login-captcha-image img').prop('src', captchaImage)
        return
      }

      if (res.data.check <= 0) {
        // Overwrite default settings if logged in.
        // Account button
        $btnAccount.attr('data-i18n', 'ACCOUNT')
        $btnAccount.off('click').on('click', () => {
          window.location.href = ACCOUNT_URL
        })

        // Pre-Register button
        if (res.data.nationality !== 'china') {
          if ($btnPreRegister) {
            $btnPreRegister.text(window.dict[window.language] ? window.dict[window.language].BTN_PRESALE : '')
            $btnPreRegister && $btnPreRegister.off('click').on('click', () => {
              window.localStorage.setItem('goto', 'center')
              window.location.href = ACCOUNT_URL
            })
          }
        }

        const captchaImage = getImageCaptcha()
        $('#authentication-captcha-image img').prop('src', captchaImage)
        $dialogLogin.removeClass('show')
        $dialogAuthentication.addClass('show')
      } else {
        window.location.href = ACCOUNT_URL
      }
    })
  })

  // Get Email Captcha for register
  $('#register-captcha-email').find('.btn').on('click', function () {
    if (registerTimer) return

    const email = $('#register-email input').val()
    const captchaImage = $('#register-captcha-image input').val()

    const {
      ERROR_INVALID_EMAIL,
      ERROR_INVALID_IMAGE_CAPTCHA,
      MESSAGE_EMAIL_SENT
    } = window.dict[window.language]

    if (!email || !REG_EMAIL.test(email)) {
      window.alert(ERROR_INVALID_EMAIL)
      return
    }
    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    const _this = $(this)

    $.ajax({
      url: '/code',
      type: 'POST',
      dataType: 'json',
      data: {
        email: email,
        vercode: captchaImage,
        send_way: 'register'
      }
    })
    .done(res => {
      // const captchaImage = getImageCaptcha()
      // $('#register-captcha-image img').prop('src', captchaImage)

      if (res.status !== 1) {
        _this.text(window.dict[window.language] ? window.dict[window.language].GET_CODE : '')
        clearInterval(registerTimer)
        registerTimer = null
        window.alert(res.msg)
        return false
      }

      registerCountDown = CAPTCHA_EMAIL_TIMEOUT
      _this.text(`(${registerCountDown}s)`)
      registerTimer = setInterval(() => {
        if (registerCountDown > 1) {
          _this.text(`(${--registerCountDown}s)`)
        } else {
          _this.text(window.dict[window.language] ? window.dict[window.language].GET_CODE : '')
          clearInterval(registerTimer)
          registerTimer = null
        }
      }, 1000)

      setTimeout(() => {
        window.alert(MESSAGE_EMAIL_SENT)
      }, 0)
    })
  })

  // Register
  $('#btn-register').on('click', () => {
    const email = $('#register-email input').val()
    const password = $('#register-password input').val()
    const captchaImage = $('#register-captcha-image input').val()
    const captchaEmail = $('#register-captcha-email input').val()

    const {
      ERROR_INVALID_EMAIL,
      ERROR_INVALID_PASSWORD,
      ERROR_INVALID_IMAGE_CAPTCHA,
      ERROR_INVALID_EMAIL_CAPTCHA
    } = window.dict[window.language]

    if (!email || !REG_EMAIL.test(email)) {
      window.alert(ERROR_INVALID_EMAIL)
      return
    }

    if (!password || !REG_PASSWORD.test(password)) {
      window.alert(ERROR_INVALID_PASSWORD)
      return
    }

    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    if (!captchaEmail) {
      window.alert(ERROR_INVALID_EMAIL_CAPTCHA)
      return
    }

    $.ajax({
      url: '/register',
      type: 'POST',
      dataType: 'json',
      data: {
        email,
        password,
        vercode: captchaImage,
        code: captchaEmail
      }
    })
    .done(res => {
      if (res.status !== 1) {
        window.alert(res.msg)
        const captchaImage = getImageCaptcha()
        $('#register-captcha-image img').prop('src', captchaImage)
        return
      }

      if (res.data.check <= 0) {
        // Overwrite default settings if logged in.
        // Account button
        $btnAccount.attr('data-i18n', 'ACCOUNT')
        $btnAccount.off('click').on('click', () => {
          window.location.href = ACCOUNT_URL
        })

        // Pre-Register button
        if (res.data.nationality !== 'china') {
          if ($btnPreRegister) {
            $btnPreRegister.text(window.dict[window.language] ? window.dict[window.language].BTN_PRESALE : '')
            $btnPreRegister && $btnPreRegister.off('click').on('click', () => {
              window.localStorage.setItem('goto', 'center')
              window.location.href = ACCOUNT_URL
            })
          }
        }

        const captchaImage = getImageCaptcha()
        $('#authentication-captcha-image img').prop('src', captchaImage)
        $dialogRegister.removeClass('show')
        $dialogAuthentication.addClass('show')
      } else {
        window.location.href = ACCOUNT_URL
      }
    })
  })

  // Get Email Captcha for reset
  $('#reset-captcha-email').find('.btn').on('click', function () {
    if (forgetTimer) return

    const email = $('#reset-email input').val()
    const captchaImage = $('#reset-captcha-image input').val()

    const {
      ERROR_INVALID_EMAIL,
      ERROR_INVALID_IMAGE_CAPTCHA,
      MESSAGE_EMAIL_SENT
    } = window.dict[window.language]

    if (!email || !REG_EMAIL.test(email)) {
      window.alert(ERROR_INVALID_EMAIL)
      return
    }
    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    const _this = $(this)

    $.ajax({
      url: '/code',
      type: 'POST',
      dataType: 'json',
      data: {
        email: email,
        vercode: captchaImage,
        send_way: 'repassword'
      }
    })
    .done(res => {
      // const captchaImage = getImageCaptcha()
      // $('#reset-captcha-image img').prop('src', captchaImage)

      if (res.status !== 1) {
        _this.text(window.dict[window.language] ? window.dict[window.language].GET_CODE : '')
        clearInterval(forgetTimer)
        forgetTimer = null
        window.alert(res.msg)
        return false
      }

      forgetCountDown = CAPTCHA_EMAIL_TIMEOUT
      _this.text(`(${forgetCountDown}s)`)
      forgetTimer = setInterval(() => {
        if (forgetCountDown > 1) {
          _this.text(`(${--forgetCountDown}s)`)
        } else {
          _this.text(window.dict[window.language] ? window.dict[window.language].GET_CODE : '')
          clearInterval(forgetTimer)
          forgetTimer = null
        }
      }, 1000)

      setTimeout(() => {
        window.alert(MESSAGE_EMAIL_SENT)
      }, 0)
    })
  })

  // Reset
  $('#btn-reset').on('click', () => {
    const email = $('#reset-email input').val()
    const password = $('#reset-password input').val()
    const captchaImage = $('#reset-captcha-image input').val()
    const captchaEmail = $('#reset-captcha-email input').val()

    const {
      ERROR_INVALID_EMAIL,
      ERROR_INVALID_PASSWORD,
      ERROR_INVALID_IMAGE_CAPTCHA,
      ERROR_INVALID_EMAIL_CAPTCHA,
      MESSAGE_PASSWORD_RESET
    } = window.dict[window.language]

    if (!email || !REG_EMAIL.test(email)) {
      window.alert(ERROR_INVALID_EMAIL)
      return
    }

    if (!password) {
      window.alert(ERROR_INVALID_PASSWORD)
      return
    }

    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    if (!captchaEmail) {
      window.alert(ERROR_INVALID_EMAIL_CAPTCHA)
      return
    }

    $.ajax({
      url: '/repassword',
      type: 'POST',
      dataType: 'json',
      data: {
        email,
        newpassword: password,
        vercode: captchaImage,
        code: captchaEmail
      }
    })
    .done(res => {
      if (res.status !== 1) {
        window.alert(res.msg)
        const captchaImage = getImageCaptcha()
        $('#reset-captcha-image img').prop('src', captchaImage)
        return
      }

      window.alert(MESSAGE_PASSWORD_RESET)

      const captchaImage = getImageCaptcha()
      $('#login-captcha-image img').prop('src', captchaImage)
      $dialogForget.removeClass('show')
      $dialogLogin.addClass('show')
    })
  })

  // Authentication
  $('#btn-authentication').on('click', () => {
    const realname = $('#authentication-realname input').val()
    const IDNumber = $('#authentication-id-number input').val()
    const country = $('#authentication-country select').val()
    const file = fileList[0]
    const captchaImage = $('#authentication-captcha-image input').val()

    const {
      ERROR_EMPTY_REALNAME,
      ERROR_EMPTY_ID_NUMBER,
      ERROR_EMPTY_COUNTRY,
      ERROR_EMPTY_ID_PHOTO,
      ERROR_INVALID_IMAGE_CAPTCHA
    } = window.dict[window.language]

    if (!realname) {
      window.alert(ERROR_EMPTY_REALNAME)
      return
    }

    if (!IDNumber) {
      window.alert(ERROR_EMPTY_ID_NUMBER)
      return
    }

    if (!country) {
      window.alert(ERROR_EMPTY_COUNTRY)
      return
    }

    if (!file) {
      window.alert(ERROR_EMPTY_ID_PHOTO)
      return
    }

    if (!captchaImage) {
      window.alert(ERROR_INVALID_IMAGE_CAPTCHA)
      return
    }

    const formdata = new window.FormData()
    formdata.append('name', realname)
    formdata.append('id_num', IDNumber)
    formdata.append('nationality', country)
    formdata.append('id_card', file)
    formdata.append('vercode', captchaImage)

    $.ajax({
      url: '/idCard',
      type: 'POST',
      dataType: 'json',
      data: formdata,
      contentType: false,
      processData: false
    })
    .done(res => {
      if (res.status !== 1) {
        window.alert(res.msg)
        const captchaImage = getImageCaptcha()
        $('#authentication-captcha-image img').prop('src', captchaImage)
        return
      }

      window.location.href = ACCOUNT_URL
    })
  })

  // Load country list
  const $countrySelect = $dialogAuthentication.find('select')
  const countryOptionDefault = `<option value=''>${COUNTRY_DEFAULT}</option>`
  $countrySelect.append($(countryOptionDefault))
  countries.map((v, i, a) => {
    const option = `<option value='${v}'>${v}</option>`
    $countrySelect.append($(option))
  })
  const countrySelectValue = $countrySelect.parent().find('.value')
  countrySelectValue.text(COUNTRY_DEFAULT)
  countrySelectValue.addClass('default')
  $countrySelect.on('change', e => {
    const value = e.target.value
    let result = ''
    if (!value) {
      result = COUNTRY_DEFAULT
      countrySelectValue.addClass('default')
    } else {
      const index = Number(value.substr(2)) - 1
      result = countries[index]
      countrySelectValue.removeClass('default')
    }
    countrySelectValue.text(result)
  })

  // File Input
  const fileInputButton = $('#dialog-authentication .file-input-button')
  fileInputButton.on('click', function () {
    const container = $(this).parent()
    const fileInput = container.find(`input[type='file']`)
    fileInput.click()
    fileInput.on('change', e => {
      const files = e.target.files
      if (!files.length) return

      const file = files[0]
      const FILESIZE_LIMIT = 2 * 1024 * 1024
      if (file.size > FILESIZE_LIMIT) {
        window.alert('File Oversized (≤ 2MB)')
        return
      }

      fileList.push(file)
      const fileReader = new window.FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = e => {
        container.find('.img-preview').addClass('has-image')
        container.find('img').attr('src', e.target.result)
      }
    })
  })

  // Default settings
  // Account button
  $btnAccount.on('click', () => {
    resetDialogs()
    const captchaImage = getImageCaptcha()
    $('#login-captcha-image img').prop('src', captchaImage)
    $dialogLogin.addClass('show')
    $dialogMask.addClass('show')
  })

  // Get Sale Progress
  $.ajax({
    url: '/getIndexInfo',
    type: 'GET',
    dataType: 'json'
  })
  .done(res => {
    if (res.status !== 1) return

    const soldINC = Number(res.data.inc_order) || 0
    const totalINC = Number(res.data.inc_amount) || 1
    const progress = Math.max(0, Math.min(1, soldINC / totalINC))

    const startYear = res.data.start_time ? parseInt(res.data.start_time.substr(0, 4)) : 0
    const startMonth = res.data.start_time ? parseInt(res.data.start_time.substr(5, 7)) - 1 : 0
    const startDate = res.data.start_time ? parseInt(res.data.start_time.substr(8, 10)) : 0
    const startHour = res.data.start_time ? parseInt(res.data.start_time.substr(11, 13)) : 0
    const startMinute = res.data.start_time ? parseInt(res.data.start_time.substr(14, 16)) : 0
    const startSecond = res.data.start_time ? parseInt(res.data.start_time.substr(17, 19)) : 0
    const startTime = new Date(startYear, startMonth, startDate, startHour, startMinute, startSecond)

    const endYear = res.data.end_time ? parseInt(res.data.end_time.substr(0, 4)) : 0
    const endMonth = res.data.end_time ? parseInt(res.data.end_time.substr(5, 7)) - 1 : 0
    const endDate = res.data.end_time ? parseInt(res.data.end_time.substr(8, 10)) : 0
    const endHour = res.data.end_time ? parseInt(res.data.end_time.substr(11, 13)) : 0
    const endMinute = res.data.end_time ? parseInt(res.data.end_time.substr(14, 16)) : 0
    const endSecond = res.data.end_time ? parseInt(res.data.end_time.substr(17, 19)) : 0
    const endTime = new Date(endYear, endMonth, endDate, endHour, endMinute, endSecond)

    const now = new Date()

    if (now >= startTime && now <= endTime && progress < 1) {
      const templateTop = `
        <h2>PRESALE PROCESS</h2>
        <div class='progress-bar'>
          <div class='current' id='sale-progress'></div>
        </div>
        <p><span id='sold-amount'>0</span> INC sold to strategic partners</p>
      `
      const templateRight = `
        <div id='btn-preregister' class='btn btn-primary-ghost btn-hover-glow' data-i18n='BTN_PRESALE'>${window.dict[window.language]['BTN_PRESALE']}</div>
      `

      const sectionPresaleProcess = $('$presale-process')
      sectionPresaleProcess.prepend($(templateTop))
      sectionPresaleProcess.find('.right').append($(templateRight))

      const currentSaleProgress = $('#sale-progress')
      const currentSoldAmount = $('#sold-amount')

      currentSaleProgress.css({
        width: progress * 100 + '%'
      })
      currentSoldAmount.text(soldINC.toLocaleString())

      $btnPreRegister = $('#btn-preregister')
      $btnPreRegister.on('click', () => {
        resetDialogs()
        const captchaImage = getImageCaptcha()
        $('#login-captcha-image img').prop('src', captchaImage)
        $dialogLogin.addClass('show')
        $dialogMask.addClass('show')
      })
    }
  })

  // Check Login Status on init
  $.ajax({
    url: '/isLogin',
    type: 'GET',
    dataType: 'json'
  })
  .done(res => {
    if (res.status !== 1) return

    // Overwrite default settings if logged in.
    // Account button
    $btnAccount.attr('data-i18n', 'ACCOUNT')
    $btnAccount.off('click').on('click', () => {
      window.location.href = ACCOUNT_URL
    })

    // Pre-Register button
    if (res.data.nationality !== 'china') {
      if ($btnPreRegister) {
        $btnPreRegister.text(window.dict[window.language] ? window.dict[window.language].BTN_PRESALE : '')
        $btnPreRegister.off('click').on('click', () => {
          window.localStorage.setItem('goto', 'center')
          window.location.href = ACCOUNT_URL
        })
      }
    }

    renderWithLanguage(window.language)
  })
}

function initInterCom () {
  // Intercom
  var INTERCOM_APP_ID = 'zi5rzkp9'
  window.intercomSettings = {
    app_id: INTERCOM_APP_ID
  }

  ;(function () {
    var w = window
    var ic = w.Intercom
    if (typeof ic === 'function') {
      ic('reattach_activator')
      ic('update', window.intercomSettings)
    } else {
      var d = document
      var i = function () { i.c(arguments) }
      i.q = []
      i.c = function (args) { i.q.push(args) }
      w.Intercom = i
      /* eslint-disable no-inner-declarations */
      function l () {
        var s = d.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID
        var x = d.getElementsByTagName('script')[0]
        x.parentNode && x.parentNode.insertBefore(s, x)
      }
      /* eslint-enable no-inner-declarations */
      if (w.attachEvent) {
        w.attachEvent('onload', l)
      } else {
        w.addEventListener('load', l, false)
      }
    }
  })()

  var config = {
    app_id: INTERCOM_APP_ID
  }

  window.Intercom('boot', config)
}

$(document).ready(() => {
  init()
  renderWithLanguage(window.language)
  initInterCom()
})
