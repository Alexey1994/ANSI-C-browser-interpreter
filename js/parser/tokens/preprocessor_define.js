function parse_preprocessor_define_token(parser)
{
	parser.skip_spaces()

	if(parser.head=='\n' || parser.end_of_data())
	{
		console.log("empty #define")
		return true
	}

	var token=''

	while(parser.head=='\\')
	{
		parser.get_byte()

		if(parser.head!='\n')
		{
			console.log('invalid macro name')
			return true
		}

		parser.skip()
		token+=parser.get_token()
	}

	console.log('#define '+token)
}