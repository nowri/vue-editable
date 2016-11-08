(function () {
  var VueEditable = {
    install: function (Vue) {
      Vue.prototype.$editable = function (e, callback) {
        var tds = document.getElementsByTagName('td')
        var target = e.target
        var value
        var input
        var len
        var sel
        // to prevent the blur event firing on creation
        var fix = true
        function setup () {
          value = target.innerText
          target.innerHTML = "<input type='text' value='" + value + "' id='_editable' style='width:100%box-sizing:border-boxbackground:transparentfont-size:13pxcolor:redtext-align:center'>"
          input = document.getElementById('_editable')
          input.focus()
          len = input.value.length
          if (document.selection) {
            sel = input.createTextRange()
            sel.moveStart('character', len)
            sel.collapse()
            sel.select()
          } else if (typeof input.selectionStart === 'number' && typeof input.selectionEnd === 'number') {
            input.selectionStart = input.selectionEnd = len
          }
          input.addEventListener('blur', action, false)
          input.addEventListener('keydown', tabAction, true)
        }

        function closest (el, fn) {
          return el && (
            fn(el) ? el : closest(el.parentNode, fn)
          )
        }

        function action () {
          if (fix) {
            if (value !== this.value && this.value !== '') {
              target.innerHTML = this.value
              callback(this.value)
            } else {
              target.innerHTML = value
            }
            input.removeEventListener('blur', action)
            input.removeEventListener('keydown', tabAction)
            fix = false
          } else {
            input.focus()
            fix = true
          }
        }

        function tabAction (event) {
          if (event.keyCode === 9) {
            var td = closest(input, function (el) {
              return el.tagName.toLowerCase() === 'td'
            })

            var next
            var i
            for (i = 0; i < tds.length; i++) {
              if (tds[i] === td) {
                next = tds[i + 1]
                break
              }
            }
            input.blur()
            if (next.getElementsByTagName('p')[0] === undefined) {
              next = tds[i + 2]
            }
            try {
              target = next.getElementsByTagName('p')[0]
              setup()
            } catch (err) {
              // throw (err)
              window.alert('End of the table reached')
            }
          }
        }
        setup()
      }
    }
  }

  module.exports = VueEditable
})()
