import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Stack,
  Group,
  Center,
  Container,
  Paper,
  Grid,
  SimpleGrid,
  Flex,
  AppShell,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function LayoutStructureDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">
        Layout & Structure Primitives
      </h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Stack</h2>
      <Stack gap="md" data-testid="stack-demo" className="max-w-md rounded-lg border border-neutral-200 p-4">
        <p className="text-sm text-neutral-900">First item</p>
        <p className="text-sm text-neutral-900">Second item</p>
        <p className="text-sm text-neutral-900">Third item</p>
      </Stack>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Group</h2>
      <Group gap="sm" data-testid="group-demo" className="max-w-md rounded-lg border border-neutral-200 p-4">
        <button type="button" className="btn-primary">Save</button>
        <button type="button" className="btn-secondary">Cancel</button>
      </Group>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Center</h2>
      <Center data-testid="center-demo" className="h-24 max-w-md rounded-lg border border-neutral-200">
        <span className="text-sm font-medium text-neutral-900">Centered content</span>
      </Center>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Container</h2>
      <Container data-testid="container-demo" className="rounded-lg border border-dashed border-neutral-300 py-4">
        <p className="text-sm text-neutral-900">Width-constrained content</p>
      </Container>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Paper</h2>
      <Paper data-testid="paper-demo" className="max-w-md p-4">
        <p className="text-sm text-neutral-900">Lightweight surface, no shadow</p>
      </Paper>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Grid</h2>
      <Grid columns={3} data-testid="grid-demo" className="max-w-2xl">
        <div className="card">Item 1</div>
        <div className="card">Item 2</div>
        <div className="card">Item 3</div>
      </Grid>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">SimpleGrid</h2>
      <SimpleGrid columns={4} data-testid="simple-grid-demo" className="max-w-2xl">
        <Paper className="p-3">A</Paper>
        <Paper className="p-3">B</Paper>
        <Paper className="p-3">C</Paper>
        <Paper className="p-3">D</Paper>
      </SimpleGrid>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Flex</h2>
      <Flex direction="row" data-testid="flex-demo" className="max-w-md rounded-lg border border-neutral-200 p-4">
        <Paper className="p-3">One</Paper>
        <Paper className="p-3">Two</Paper>
      </Flex>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">AppShell</h2>
      <div className="mt-3 max-w-2xl overflow-hidden rounded-lg border border-neutral-200">
        <AppShell
          data-testid="app-shell-demo"
          header={
            <header className="navbar" data-testid="app-shell-header">
              <div className="navbar-inner">
                <span className="text-lg font-bold text-neutral-900">Acme</span>
              </div>
            </header>
          }
          sidebar={
            <nav aria-label="Main" className="sidebar sidebar-light" data-testid="app-shell-sidebar">
              <a href="#" aria-current="page" className="sidebar-item sidebar-item-light">Dashboard</a>
              <a href="#" className="sidebar-item sidebar-item-light">Settings</a>
            </nav>
          }
        >
          <p className="text-sm text-neutral-900">Main content region</p>
        </AppShell>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LayoutStructureDemo />
  </StrictMode>,
);
