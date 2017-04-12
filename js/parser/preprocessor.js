var preprocessor_tokens={
	'define':  parse_define,
	'include': parse_include
}


function execute_define_template(parser, stream)
{
	var defines_count = 0
	var result = ''


	function skip_spaces()
	{
		while( !end_of_stream(stream) && is_space( stream.head ) )
			read_stream_byte(stream)
	}

	function parse_word()
	{
		skip_spaces()

		if( !is_letter(stream.head) )
			return

		var word = ''
		var head = stream.head

		while(!end_of_stream(stream) && ( is_letter(head) || is_number(head) || head == '_' ))
		{
			word += head

			read_stream_byte(stream)
			head = stream.head
		}

		return word
	}


	function replace_macro_arguments(parser, stream, macro, identifer)
	{
		var result = ''

		skip_spaces()

		if(end_of_stream(stream) || stream.head != '(')
		{
			//console.log('missing (')
			--defines_count
			return identifer
		}

		read_stream_byte(stream)

		//read arguments from parser stream

		skip_spaces()

		while(!end_of_stream(stream) && stream.head != ')')
		{
			var argument = ''

			while(!end_of_stream(stream) && stream.head != ',' && stream.head != ')')
			{
				argument += stream.head
				read_stream_byte(stream)
			}

			console.log(argument)

			if(stream.head == ')')
				break

			read_stream_byte(stream)
		}

		if(stream.head != ')')
		{
			console.log('missing ) in macro')
			return
		}

		read_stream_byte(stream)

		return result
	}


	for(; !end_of_stream(stream); )
	{
		while(!end_of_stream(stream) && !( is_letter(stream.head) || stream.head == '_' ))
		{
			if(stream.head == '"')
			{
				result += stream.head
				read_stream_byte(stream)

				while(!end_of_stream(stream) && stream.head != '"')
				{
					result += stream.head
					read_stream_byte(stream)
				}

				if(end_of_stream(stream))
				{
					console.log('expected "')
					return
				}

				result += stream.head
				read_stream_byte(stream)
			}
			else
			{
				result += stream.head
				read_stream_byte(stream)
			}
		}

		var identifer = parse_word()
		var macro = parser.defines[identifer]

		if(!macro)
		{
			if(identifer)
				result += identifer
			
			continue
		}

		++defines_count

		if(macro.arguments !== undefined)
		{
			result += replace_macro_arguments(parser, stream, macro, identifer)
			//console.log('with arguments:)')
			continue
		}

		console.log(macro)

		result += macro.macro
	}

	console.log(result)

	var macro_source = {
		i:    0,
		data: result
	}

	var macro_stream = create_stream(macro_source, get_text_byte, end_of_text_data)

	if(defines_count)
		return execute_define_template(parser, macro_stream)

	parser.macro_stream = macro_stream

	return 1
}


function execute_preprocessor_define(parser)
{
	return execute_define_template(parser, parser.preprocessor_stream)
}


function read_preprocessor_string(parser)
{
	var string = ''

	while(!parser.end_of_data() && parser.head() != '\n')
	{
		if(parser.head() == '\\')
		{
			parser.read_byte()

			if(parser.head() == '\n' || parser.head() == '\r')
				parser.read_byte()
			else
				string += '\\'
		}
		else
		{
			string += parser.head()
			parser.read_byte()
		}
	}

	return string
}


function parse_macro(parser)
{
	var macro = ''

	parser.skip_preprocessor_spaces()

	while(!parser.end_of_preprocessor_data())
	{
		macro += parser.preprocessor_head()
		parser.read_preprocessor_byte()
	}

	return macro
}


function parse_preprocessor(parser)
{
	parser.read_byte()

	var preprocessor_string = read_preprocessor_string(parser)
	console.log('preprocessor string: ' + preprocessor_string )

	var text_source = {
		i:    0,
		data: preprocessor_string
	}

	parser.preprocessor_stream = create_stream(text_source, get_text_byte, end_of_text_data)


	var token = parser.parse_preprocessor_word()

	console.log('preprocessor token ' + token)

	var token_function = preprocessor_tokens[token]

	if(!token_function)
	{
		console.log('preprocessing directive #' + token + ' not defined')
		return
	}

	if(!token_function(parser))
		return

	return 1
}