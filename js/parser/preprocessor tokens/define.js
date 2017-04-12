function parse_define_arguments_list(parser)
{
	var identifer_arguments = []

	parser.read_preprocessor_byte()
	parser.skip_preprocessor_spaces()

	while(!parser.end_of_preprocessor_data() && parser.preprocessor_head() != '\n' && parser.preprocessor_head() != ')')
	{
		var argument = parser.parse_preprocessor_word()

		if(!argument)
		{
			console.log('"' + parser.preprocessor_head() + '" not appear in define arguments')
			return
		}

		identifer_arguments.push(argument)

		parser.skip_preprocessor_spaces()

		if(parser.preprocessor_head() != ',')
		{
			if(parser.preprocessor_head() != ')')
			{
				console.log('missing ,');
				return
			}

			break
		}

		parser.read_preprocessor_byte()
		parser.skip_preprocessor_spaces()
	}

	if(parser.preprocessor_head() != ')')
	{
		console.log('missing ) in define arguments')
		return
	}

	parser.read_preprocessor_byte()

	return identifer_arguments
}


function index_of_macro_argument(string, argument)
{
	var i=0
	var concurence_count

	while(i<string.length)
	{
		while(i<string.length && !is_letter(string[i]) && string[i] != '_')
			++i

		concurence_count = 0

		while(i<string.length && (is_letter(string[i]) || string[i] != '_'))
		{
			if(concurence_count < string.length && string[i] == argument[concurence_count])
				++concurence_count
			else
				break

			++i
		}

		if(concurence_count == argument.length)
			console.log(i)

		while(i<string.length && (is_letter(string[i]) || string[i] == '_'))
			++i
	}
}


function calculate_define_pattern(identifer_arguments, macro)
{
	if(identifer_arguments === undefined)
		return

	var pattern = [macro]

	for(var i=0; i<identifer_arguments.length; ++i)
	{
		var argument = identifer_arguments[i]

		for(var j=0; j<pattern.length; j+=2)
		{
			index_of_macro_argument(macro, argument)
		}
	}
}


function parse_define(parser)
{
	var define_identifer = parser.parse_preprocessor_word()
	var identifer_arguments

	console.log('#define ' + define_identifer)

	if(parser.preprocessor_head() == '(') //parse complex identifer
	{
		identifer_arguments = parse_define_arguments_list(parser)
		console.log('define arguments ' + identifer_arguments)
	}

	var macro = parse_macro(parser)

	parser.defines[ define_identifer ] = {
		arguments: identifer_arguments,
		macro:     macro,
		pattern:   calculate_define_pattern(identifer_arguments, macro)
	}

	return 1
}

/*----------------tests----------------*/

/*
/////////////////////////////////////////
	#define
/////////////////////////////////////////error
	# define
/////////////////////////////////////////
	#define a 21eswe
/////////////////////////////////////////
	#define a 2+\
	2
/////////////////////////////////////////
	#define a ()
/////////////////////////////////////////
	#define a()
/////////////////////////////////////////error
	#define a(
/////////////////////////////////////////
	#define a(a)
/////////////////////////////////////////error
	#define a(1)
/////////////////////////////////////////
	#define a(a, b)
/////////////////////////////////////////error
	#define a(a b)
*/