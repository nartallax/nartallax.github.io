import {Koramund} from "@nartallax/koramund";

export async function main(): Promise<void> {
	let controller = Koramund.create({
		log: opts => console.error(`${opts.timeStr} | ${opts.paddedProjectName} | ${opts.message}`)
	});

	let server: Koramund.ImploderProject & Koramund.HttpProxifyableProject = controller.addProject({
		name: "Server",
		imploderTsconfigPath: "server/tsconfig.json",
		imploderProfile: "development",
		getLaunchCommand: () => [controller.nodePath, server.getImploder().config.outFile],
		proxyHttpPort: 6342
	});

	server.onStderr(line => {
		let m = line.match(/^Started at (\d+)$/)
		if(m){
			server.notifyProjectHttpPort(parseInt(m[1]));
			server.notifyLaunched();
		}
	});

	server.onHttpRequest(async req => {
		if(!req.url.match(/\./)){
			await server.restart()
		}
	})

	let client = controller.addProject({
		name: "Client",
		imploderTsconfigPath: "client/tsconfig.json",
		imploderProfile: "development"
	});

	await client.build(); // starting the Imploder
	await server.start();
}