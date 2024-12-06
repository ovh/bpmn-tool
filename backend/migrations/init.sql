CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE contents_status_enum AS ENUM (
    'obsolete',
    'draft',
    'published'
);

CREATE TYPE resources_type_enum AS ENUM (
    'folder',
    'process'
);

CREATE TABLE resources (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "createdBy" character varying(64) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    depth integer NOT NULL,
    "parentId" character varying,
    "authToken" VARCHAR(64),
    type resources_type_enum NOT NULL
);

CREATE TABLE comments (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "createdBy" character varying(64) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "resourceId" uuid NOT NULL,
    comment text NOT NULL,
    "updatedBy" character varying(64) NOT NULL,
    CONSTRAINT "comments_to_resources_fk"
        FOREIGN KEY ("resourceId")
            REFERENCES resources(id) ON DELETE CASCADE
);

CREATE TABLE contents (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "createdBy" character varying(64) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "resourceId" uuid NOT NULL,
    status contents_status_enum NOT NULL,
    version integer,
    content text NOT NULL,
    "pngContent" BYTEA,
    "updatedBy" character varying(64) NOT NULL,
    CONSTRAINT "contents_to_resources_fk"
        FOREIGN KEY ("resourceId")
            REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX ON resources("name");
CREATE INDEX ON comments("resourceId");
CREATE INDEX ON contents("resourceId");
