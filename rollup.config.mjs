// import { type RollupOptions } from "rollup";

const conf1 = {
	input: {
		"villa1": "src/file1.ts",
		"villa2": "src/file2.ts",
		"villa3": "src/sample/dir/file3.ts",
	},
	plugins: [
		{
			name: "plugin-1",
			transform(code, id) {
				console.log([code, id]);
				return code;
			},
		}
	],
	output: [
		{
			name: "villa1",
			dir: "dist/a",
		},
		{
			name: "villa2",
			dir: "dist/b",
		}
	],
}; // as RollupOptions;

const conf2 = [
	{
		input: "src/file1.ts",
		output: {
			dir: "dist/a",
		},
	},
	{
		input: "src/file2.ts",
		output: {
			dir: "dist/b",
		},
	},
];

export default conf1;