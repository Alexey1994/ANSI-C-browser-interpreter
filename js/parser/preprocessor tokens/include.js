function parse_relative_path(parser, macro_stream)
{
	var path = ''

	read_stream_byte(macro_stream)

	while(macro_stream.head != '"')
	{
		path += macro_stream.head
		read_stream_byte(macro_stream)
	}

	return path
}


function parse_system_path(parser, macro_stream)
{
	var path = ''

	read_stream_byte(macro_stream)

	while(!end_of_stream(macro_stream) && macro_stream.head != '>')
	{
		path += macro_stream.head
		read_stream_byte(macro_stream)
	}

	if(end_of_stream(macro_stream))
	{
		console.log('missing > in include')
		return 0
	}

	return path
}


function parse_include(parser)
{
	var path

	parser.skip_preprocessor_spaces()
	//var head = parser.preprocessor_head()

	if(!execute_preprocessor_define(parser))
		return 0

	var macro_stream = parser.macro_stream

	console.log(macro_stream)

	var head = macro_stream.head

	switch(head)
	{
		case '<': path = parse_system_path(parser, macro_stream); break;
		case '"': path = parse_relative_path(parser, macro_stream); break;
		default:
			console.log('missing < or " in include')
			return 0
	}

	console.log('#include `' + path + '`')

	return 1
}