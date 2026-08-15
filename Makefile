.PHONY: dev build typecheck test clean format deploy

dev:
	pnpm dev --turbo

build:
	pnpm build

typecheck:
	tsc --noEmit

test:
	node --test $$(find test -name '*.test.*' 2>/dev/null)

clean:
	rm -rf .next

format:
	pnpm lint

deploy:
	ssh minecraftle
