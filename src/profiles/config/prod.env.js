/*
 * 线上 -- www.gaex.com环境配置
 * */
export default {
	server: {
		baseUrl: 'https://jerry.matrix.io',
	},
	// 用于控制开发阶段和发布阶段的一些调用控制，可以无缝接入
	setting: {
		// 是否引入axios启自定义请求头
		customHttpHeader: true,
		// 是否为正式请求头
		permission: true,
		// Vue的history模式
		historyMode: 'hash'
	}
}