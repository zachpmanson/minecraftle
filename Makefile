.PHONY: dev build typecheck clean format deploy

dev:
	pnpm dev --turbo

build:
	pnpm build

typecheck:
	tsc --noEmit

clean:
	rm -rf .next

format:
	pnpm lint

deploy:
	ssh minecraftle
