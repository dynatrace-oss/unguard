exports.loggerFactory = function (winston) {
	this._winston = winston;

	this._loggerColorConfig = {
		error: 'red',
		http: 'yellow',
		warn: 'yellow',
		info: 'white',
		debug: 'green'
	};

	this._winston.addColors(this._loggerColorConfig);

	this.create = function (context) {
		const errorFileTransport = new this._winston.transports.File({filename: 'error.log', level: 'error'});
		const combinedFileTransport = new this._winston.transports.File({filename: 'combined.log'});
		const logger = this._winston.createLogger();

		if (process.env.NODE_ENV === 'production') {
			logger.add(errorFileTransport);
			logger.add(combinedFileTransport);
		}

		const levelFormat = this._winston.format((info, opts) => {
			const {level} = info;

			if (opts.context === undefined) {
				throw new Error('Log context can\'t be empty');
			}

			info.level = `[${level?.toUpperCase()}] (${opts.context.toUpperCase()})`;

			return info;
		});

		const messageFormat = this._winston.format((info) => {
			const {message, level, ...meta} = info;

			if (level === 'error' && meta.errorType === 'http') {
				const {request, response, config} = message;

				if (request) {
					const {method, url} = config;
					info.message = `${method.toUpperCase()} request to ${url} failed`;
				}

				if (response) {
					const {data: {message: axiosMessage}} = response;

					info.message += `: ${axiosMessage}`;
				} else {
					info.message += `: ${message}`
				}
			}

			return info;
		})();

		const consoleTransport = new this._winston.transports.Console({
			level: 'http',
			format: this._winston.format.combine(
				messageFormat,
				this._winston.format.colorize({all: true}),
				levelFormat({context: context}),
				this._winston.format.timestamp(),
				this._winston.format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`),
			),
		});
		logger.add(consoleTransport);

		return logger;
	}

}
