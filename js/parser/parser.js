function create_parser(input_stream)
{
	return {
		input_stream: input_stream,

		read_byte: function()
		{
			read_stream_byte(this.input_stream)
		},

		head: function()
		{
			return this.input_stream.head
		},

		end_of_data: function()
		{
			return end_of_stream(this.input_stream)
		},

		skip_spaces: function()
		{
			while( !end_of_stream(this.input_stream) && is_space( this.head() ) )
				this.read_byte()
		},

		parse_word: function()
		{
			this.skip_spaces()

			if( !is_letter(this.input_stream.head) )
				return

			var word = ''
			var head = this.head()

			while(!end_of_stream(this.input_stream) && ( is_letter(head) || is_number(head) || head == '_' ))
			{
				word += head

				this.read_byte()
				head = this.head()
			}

			return word
		},

		///////////////////////////////////////////////////////////

		defines: {},
		preprocessor_stream: undefined,
		macro_stream: undefined,

		read_preprocessor_byte: function()
		{
			read_stream_byte(this.preprocessor_stream)
		},

		preprocessor_head: function()
		{
			return this.preprocessor_stream.head
		},

		end_of_preprocessor_data: function()
		{
			return end_of_stream(this.preprocessor_stream)
		},

		skip_preprocessor_spaces: function()
		{
			while( !this.end_of_preprocessor_data() && is_space( this.preprocessor_head() ) )
				this.read_preprocessor_byte()
		},

		parse_preprocessor_word: function()
		{
			this.skip_preprocessor_spaces()

			if( !is_letter(this.preprocessor_head()) )
				return

			var word = ''
			var head = this.preprocessor_head()

			while(!this.end_of_preprocessor_data() && ( is_letter(head) || is_number(head) || head == '_' ))
			{
				word += head

				this.read_preprocessor_byte()
				head = this.preprocessor_head()
			}

			return word
		}
	}
}


function parse(input_stream)
{
	var parser = create_parser(input_stream)

	while(!end_of_stream(parser.input_stream))// || (parser.macro_stream && !end_of_stream(parser.macro_stream)))
	{
		parser.skip_spaces()

		var head = parser.head()

		if(head == '#')
			if(!parse_preprocessor(parser))
				return
		else
			if(!parse_line(parser))
				return

		parser.skip_spaces()

		//parser.parse_word()
		//console.log( parser.parse_word() )
	}

	//console.log(parser.defines)
}