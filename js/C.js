var text=document.getElementById('code')


function run_C()
{
	var text_source = {
		i:    0,
		data: text.value
	}


	parse( create_stream(text_source, get_text_byte, end_of_text_data) )

/*
	var code={
		text:     text.value,//     '  print ( 1 + 2 ) + 3 print b print 10',
		position: 0
	}


	function end_of_data(code)
	{
		if(code.position>code.text.length)
			return true

		return false
	}


	function get_byte(code)
	{
		byte=code.text[code.position]
		code.position++

		return byte
	}


	parse(code, get_byte, end_of_data)*/
}