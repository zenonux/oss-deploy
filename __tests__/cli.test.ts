describe("cli", () => {
  let originalArgv: any;

  beforeEach(() => {
    // Remove all cached modules. The cache needs to be cleared before running
    // each command, otherwise you will see the same results from the command
    // run in your first test in subsequent tests.
    jest.resetModules();

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv;
  });

  afterEach(() => {
    jest.resetAllMocks();

    // Set process arguments back to the original value
    process.argv = originalArgv;
  });

  it("should run upload command", async () => {
    const consoleSpy = jest.spyOn(console, "info");

    await runCommand("upload", "stag");

    expect(consoleSpy).toBeCalledWith(expect.stringContaining("success"));
  });
});

/**
 * Programmatically set arguments and execute the CLI script
 *
 * @param {...string} args - positional and option arguments for the command to run
 */
async function runCommand(...args: any[]) {
  process.argv = [
    "node", // Not used but a value is required at this index in the array
    "cli.js", // Not used but a value is required at this index in the array
    ...args,
  ];

  // Require the yargs CLI script
  return require("../dist/cli");
}
