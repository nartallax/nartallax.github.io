import {Koramund} from "@nartallax/koramund";
import {promises as Fs} from "fs";
import * as Path from "path";

export async function main(): Promise<void> {
	let controller = Koramund.create({
		log: opts => console.error(`${opts.timeStr} | ${opts.paddedProjectName} | ${opts.message}`)
	});

	let server: Koramund.ImploderProject & Koramund.HttpProxifyableProject = controller.addProject({
		name: "Server",
		imploderTsconfigPath: "website/server/tsconfig.json",
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
		imploderTsconfigPath: "website/client/tsconfig.json",
		imploderProfile: "development"
	});

	let clientsideProjects = [client] as Koramund.ImploderProject[];
	for(let sketchName of (await Fs.readdir("sketches"))){
		if(sketchName === "common"){
			continue;
		}
		let sketch = controller.addProject({
			name: sketchName,
			imploderTsconfigPath: Path.join("sketches", sketchName, "tsconfig.json"),
			imploderProfile: "development"
		});

		clientsideProjects.push(sketch);
	}

	await Promise.all<unknown>([
		server.start(),
		...clientsideProjects.map(proj => proj.getOrStartImploder())
	]);
}