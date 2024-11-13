/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from ".";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@prisma/client';
import type { UseTRPCMutationOptions, UseTRPCMutationResult, UseTRPCQueryOptions, UseTRPCQueryResult, UseTRPCInfiniteQueryOptions, UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({

        createMany: procedure.input($Schema.VariantInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.createMany(input as any))),

        create: procedure.input($Schema.VariantInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.create(input as any))),

        deleteMany: procedure.input($Schema.VariantInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.deleteMany(input as any))),

        delete: procedure.input($Schema.VariantInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.delete(input as any))),

        findFirst: procedure.input($Schema.VariantInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).variant.findFirst(input as any))),

        findMany: procedure.input($Schema.VariantInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).variant.findMany(input as any))),

        findUnique: procedure.input($Schema.VariantInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).variant.findUnique(input as any))),

        updateMany: procedure.input($Schema.VariantInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.updateMany(input as any))),

        update: procedure.input($Schema.VariantInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).variant.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.VariantCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.VariantCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.VariantGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.VariantGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.VariantGetPayload<T>, Context>) => Promise<Prisma.VariantGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.VariantDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.VariantDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.VariantGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.VariantGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.VariantGetPayload<T>, Context>) => Promise<Prisma.VariantGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.VariantFindFirstArgs, TData = Prisma.VariantGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.VariantFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.VariantGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.VariantFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.VariantFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.VariantGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.VariantGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.VariantFindManyArgs, TData = Array<Prisma.VariantGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.VariantFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.VariantGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.VariantFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.VariantFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.VariantGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.VariantGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.VariantFindUniqueArgs, TData = Prisma.VariantGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.VariantFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.VariantGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.VariantFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.VariantFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.VariantGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.VariantGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.VariantUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.VariantUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.VariantUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.VariantGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.VariantGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.VariantUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.VariantUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.VariantGetPayload<T>, Context>) => Promise<Prisma.VariantGetPayload<T>>
            };

    };
}
